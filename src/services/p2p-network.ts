import { createLibp2p, Libp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { webSockets } from '@libp2p/websockets';
import { mplex } from '@libp2p/mplex';
import { noise } from '@libp2p/noise';
import { kadDHT } from '@libp2p/kad-dht';
import { mdns } from '@libp2p/mdns';
import { bootstrap } from '@libp2p/bootstrap';
import { PeerId } from '@libp2p/interface-peer-id';
import { EventEmitter } from 'events';
import { logger } from '../utils/logger';
import { config } from '../utils/config';
import { 
  P2PMessage, 
  ContentOffer, 
  ContentRequest, 
  PeerConnection,
  RTCConnectionState 
} from '../types';

export interface P2PNetworkEvents {
  'peer:connected': (peerId: PeerId) => void;
  'peer:disconnected': (peerId: PeerId) => void;
  'content:offer': (offer: ContentOffer, from: PeerId) => void;
  'content:request': (request: ContentRequest, from: PeerId) => void;
  'peer:discovery': (peerId: PeerId) => void;
}

export class P2PNetworkService extends EventEmitter {
  private node?: Libp2p;
  private peers: Map<string, PeerConnection> = new Map();
  private isStarted = false;

  constructor() {
    super();
  }

  /**
   * Initialize and start the P2P network node
   */
  public async start(): Promise<void> {
    if (this.isStarted) {
      logger.warn('P2P network already started');
      return;
    }

    try {
      logger.info('Starting P2P network node...');

      this.node = await createLibp2p({
        addresses: {
          listen: [`/ip4/0.0.0.0/tcp/${config.p2p.listenPort}`]
        },
        transports: [
          tcp(),
          webSockets()
        ],
        streamMuxers: [
          mplex()
        ],
        connectionEncryption: [
          noise()
        ],
        peerDiscovery: [
          mdns({
            interval: 20000
          }),
          bootstrap({
            list: config.p2p.bootstrapPeers
          })
        ],
        services: {
          dht: kadDHT({
            clientMode: false
          })
        },
        connectionManager: {
          maxConnections: 100,
          minConnections: 10
        }
      });

      // Set up event handlers
      this.setupEventHandlers();

      // Start the node
      await this.node.start();
      
      this.isStarted = true;
      logger.info(`P2P node started with PeerId: ${this.node.peerId.toString()}`);
      logger.info(`Listening on: ${this.node.getMultiaddrs().map(ma => ma.toString()).join(', ')}`);

    } catch (error) {
      logger.error('Failed to start P2P network:', error);
      throw error;
    }
  }

  /**
   * Stop the P2P network node
   */
  public async stop(): Promise<void> {
    if (!this.isStarted || !this.node) {
      return;
    }

    try {
      logger.info('Stopping P2P network node...');
      await this.node.stop();
      this.isStarted = false;
      this.peers.clear();
      logger.info('P2P network node stopped');
    } catch (error) {
      logger.error('Error stopping P2P network:', error);
      throw error;
    }
  }

  /**
   * Get current node's peer ID
   */
  public getPeerId(): string | null {
    return this.node ? this.node.peerId.toString() : null;
  }

  /**
   * Get list of connected peers
   */
  public getConnectedPeers(): PeerConnection[] {
    return Array.from(this.peers.values()).filter(peer => peer.isOnline);
  }

  /**
   * Get peer connection info
   */
  public getPeer(peerId: string): PeerConnection | undefined {
    return this.peers.get(peerId);
  }

  /**
   * Send message to specific peer
   */
  public async sendToPeer(peerId: string, message: P2PMessage): Promise<void> {
    if (!this.node) {
      throw new Error('P2P node not started');
    }

    try {
      const peer = this.peers.get(peerId);
      if (!peer || !peer.isOnline) {
        throw new Error(`Peer ${peerId} not connected`);
      }

      // TODO: Implement actual message sending via libp2p streams
      logger.debug(`Sending message to peer ${peerId}:`, message);
      
    } catch (error) {
      logger.error(`Failed to send message to peer ${peerId}:`, error);
      throw error;
    }
  }

  /**
   * Broadcast message to all connected peers
   */
  public async broadcast(message: P2PMessage): Promise<void> {
    const connectedPeers = this.getConnectedPeers();
    
    const promises = connectedPeers.map(peer => 
      this.sendToPeer(peer.peerId, message).catch(error => {
        logger.warn(`Failed to send broadcast to peer ${peer.peerId}:`, error);
      })
    );

    await Promise.allSettled(promises);
    logger.debug(`Broadcast message sent to ${connectedPeers.length} peers`);
  }

  /**
   * Request content from peers
   */
  public async requestContent(hash: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
    const request: ContentRequest = {
      hash,
      priority
    };

    const message: P2PMessage = {
      type: 'content-request',
      payload: request,
      timestamp: new Date(),
      sender: this.getPeerId() || 'unknown'
    };

    await this.broadcast(message);
    logger.info(`Content request sent for hash: ${hash}`);
  }

  /**
   * Offer content to peers
   */
  public async offerContent(hash: string, size: number, chunks: number, bandwidth: number): Promise<void> {
    const offer: ContentOffer = {
      hash,
      size,
      chunks,
      bandwidth,
      ttl: Date.now() + (60 * 60 * 1000) // 1 hour TTL
    };

    const message: P2PMessage = {
      type: 'content-offer',
      payload: offer,
      timestamp: new Date(),
      sender: this.getPeerId() || 'unknown'
    };

    await this.broadcast(message);
    logger.info(`Content offer sent for hash: ${hash}`);
  }

  /**
   * Find peers that have specific content
   */
  public async findContentPeers(hash: string): Promise<PeerConnection[]> {
    return this.getConnectedPeers().filter(peer => 
      peer.contentShared.includes(hash)
    );
  }

  /**
   * Update peer connection quality
   */
  public updatePeerQuality(peerId: string, quality: number, bandwidth: number): void {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.connectionQuality = Math.max(0, Math.min(1, quality));
      peer.bandwidth = bandwidth;
      peer.lastSeen = new Date();
    }
  }

  /**
   * Add content to peer's shared list
   */
  public addPeerContent(peerId: string, contentHash: string): void {
    const peer = this.peers.get(peerId);
    if (peer && !peer.contentShared.includes(contentHash)) {
      peer.contentShared.push(contentHash);
    }
  }

  /**
   * Remove content from peer's shared list
   */
  public removePeerContent(peerId: string, contentHash: string): void {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.contentShared = peer.contentShared.filter(hash => hash !== contentHash);
    }
  }

  /**
   * Get network statistics
   */
  public getNetworkStats() {
    const peers = Array.from(this.peers.values());
    const onlinePeers = peers.filter(p => p.isOnline);
    
    return {
      totalPeers: peers.length,
      onlinePeers: onlinePeers.length,
      averageQuality: onlinePeers.reduce((sum, p) => sum + p.connectionQuality, 0) / Math.max(onlinePeers.length, 1),
      totalBandwidth: onlinePeers.reduce((sum, p) => sum + p.bandwidth, 0),
      uniqueContent: new Set(peers.flatMap(p => p.contentShared)).size
    };
  }

  /**
   * Set up libp2p event handlers
   */
  private setupEventHandlers(): void {
    if (!this.node) return;

    // Peer connection events
    this.node.addEventListener('peer:connect', (event) => {
      const peerId = event.detail.toString();
      logger.info(`Peer connected: ${peerId}`);
      
      // Add or update peer
      this.peers.set(peerId, {
        peerId,
        multiaddr: '', // TODO: Get actual multiaddr
        isOnline: true,
        lastSeen: new Date(),
        connectionQuality: 0.5,
        bandwidth: 0,
        contentShared: []
      });

      this.emit('peer:connected', event.detail);
    });

    this.node.addEventListener('peer:disconnect', (event) => {
      const peerId = event.detail.toString();
      logger.info(`Peer disconnected: ${peerId}`);
      
      // Mark peer as offline
      const peer = this.peers.get(peerId);
      if (peer) {
        peer.isOnline = false;
      }

      this.emit('peer:disconnected', event.detail);
    });

    // Peer discovery events
    this.node.addEventListener('peer:discovery', (event) => {
      const peerId = event.detail.id.toString();
      logger.debug(`Peer discovered: ${peerId}`);
      this.emit('peer:discovery', event.detail.id);
    });

    // Handle incoming streams for custom protocols
    // TODO: Implement custom protocol handlers for content sharing
  }

  /**
   * Handle incoming P2P messages
   */
  private handleIncomingMessage(message: P2PMessage, from: PeerId): void {
    logger.debug(`Received message from ${from.toString()}:`, message);

    switch (message.type) {
      case 'content-offer':
        this.emit('content:offer', message.payload as ContentOffer, from);
        break;
      
      case 'content-request':
        this.emit('content:request', message.payload as ContentRequest, from);
        break;
      
      case 'peer-update':
        // Handle peer status updates
        break;
      
      default:
        logger.warn(`Unknown message type: ${message.type}`);
    }
  }
}

// Singleton instance
export const p2pNetwork = new P2PNetworkService();