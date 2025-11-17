import { 
  Activity, 
  Emotion, 
  GroupDynamic, 
  CORE_ACTIVITIES,
  ContentItem,
  ContentSearchRequest 
} from '../types';

export class ContextualGenreSystem {
  private events: Record<Activity, string[]>;
  private groupDynamics: Record<GroupDynamic, string[]>;
  private emotions: Record<Emotion, string[]>;
  private contextualGenres: Record<string, string>;

  constructor() {
    this.events = CORE_ACTIVITIES as unknown as Record<Activity, string[]>;
    
    this.groupDynamics = {
      'friend': ['casual', 'shared-interests', 'contemporary', 'relatable'],
      'family': ['inclusive', 'multi-generational', 'safe', 'universal'],
      'partner': ['intimate', 'personal', 'romantic', 'connected'],
      'spouse': ['comfortable', 'familiar', 'shared-history', 'loving'],
      'parent': ['respectful', 'appropriate', 'nostalgic', 'bonding'],
      'child': ['playful', 'age-appropriate', 'fun', 'engaging'],
      'sibling': ['nostalgic', 'competitive', 'shared-memories', 'teasing'],
      'cousin': ['family-friendly', 'reunion-vibe', 'celebratory', 'warm'],
      'colleague': ['professional', 'neutral', 'workplace-safe', 'polite'],
      'peer': ['contemporary', 'relevant', 'shared-culture', 'trendy'],
      'competitive': ['intense', 'motivating', 'challenging', 'focused']
    };

    this.emotions = {
      'nostalgia': ['vintage', 'reminiscent', 'bittersweet', 'memory-evoking'],
      'happy': ['upbeat', 'joyful', 'positive', 'celebratory'],
      'sad': ['melancholic', 'slow', 'minor-key', 'emotional'],
      'love': ['romantic', 'tender', 'passionate', 'heartfelt'],
      'scared': ['tense', 'dramatic', 'suspenseful', 'intense'],
      'hurt': ['raw', 'emotional', 'cathartic', 'healing'],
      'relaxed': ['calm', 'peaceful', 'soothing', 'gentle'],
      'tense': ['edgy', 'anxious', 'high-energy', 'urgent']
    };

    // Enhanced genre recommendations based on context
    this.contextualGenres = {
      // Work contexts
      'work,colleague,relaxed': 'Productivity Ambient',
      'work,peer,happy': 'Lo-fi Focus Beats',
      'study,friend,relaxed': 'Study Chill',
      'creative_work,peer,happy': 'Creative Flow',
      
      // Exercise contexts  
      'workout,competitive,tense': 'Workout Trap',
      'run,friend,happy': 'Running Pop Hits',
      'dance,friend,happy': 'Dance Floor Bangers',
      'yoga,partner,relaxed': 'Meditation Soundscapes',
      
      // Social contexts
      'eat,family,nostalgia': 'Dinner Jazz Classics',
      'hang_out,friend,happy': 'Social Hits',
      'party,friend,happy': 'Party Anthems',
      'date,partner,love': 'Romantic Evening',
      
      // Home activities
      'cook,family,happy': 'Kitchen Sing-Alongs',
      'clean,peer,happy': 'Cleaning Motivation',
      
      // Relaxation contexts
      'relax,spouse,love': 'Romantic Chill',
      'read,family,relaxed': 'Reading Ambience',
      'sleep,partner,relaxed': 'Sleep Sounds',
      
      // Daily routines
      'morning_routine,family,happy': 'Morning Energy',
      'commute,peer,relaxed': 'Commute Companion',
      'getting_ready,friend,happy': 'Get Ready Hits',
      
      // Transportation
      'drive,friend,happy': 'Road Trip Classics',
      'fly,partner,relaxed': 'Travel Chill',
      
      // Emotional contexts
      'think,family,nostalgia': 'Contemplative Classics',
      'cry,partner,hurt': 'Healing Music',
      'celebrate,friend,happy': 'Victory Songs'
    };
  }

  /**
   * Get genre recommendation based on context
   */
  public getRecommendation(
    event: Activity, 
    groupSelection: GroupDynamic[], 
    emotion: Emotion
  ): string {
    // Create context key for main combinations
    const primaryGroup = groupSelection[0] || 'peer';
    const contextKey = `${event},${primaryGroup},${emotion}`;
    
    // Check for exact match
    if (this.contextualGenres[contextKey]) {
      return this.contextualGenres[contextKey];
    }
    
    // Fallback to general recommendations
    return this.generateFallbackRecommendation(event, groupSelection, emotion);
  }

  /**
   * Generate recommendation when no exact match exists
   */
  private generateFallbackRecommendation(
    event: Activity, 
    groups: GroupDynamic[], 
    emotion: Emotion
  ): string {
    const eventDesc = this.events[event] || ['general'];
    const emotionDesc = this.emotions[emotion] || ['neutral'];
    
    // Simple combination logic based on activity attributes
    if (eventDesc.includes('high-intensity') && emotion === 'happy') {
      return 'Energetic Pop';
    } else if (eventDesc.includes('peaceful') && emotion === 'relaxed') {
      return 'Ambient Chill';
    } else if (eventDesc.includes('social') && groups.includes('friend')) {
      return 'Social Hits';
    } else if (eventDesc.includes('romantic') && groups.includes('partner')) {
      return 'Romantic Collection';
    } else if (eventDesc.includes('motivational') && emotion === 'tense') {
      return 'Motivational Beats';
    } else if (eventDesc.includes('contemplative') && emotion === 'nostalgia') {
      return 'Nostalgic Reflections';
    }
    
    // Default fallback
    return `${this.capitalize(emotion)} ${this.capitalize(event)} Mix`;
  }

  /**
   * Get all activities grouped by category
   */
  public getActivitiesByCategory(): Record<string, Activity[]> {
    return {
      physical: ['workout', 'yoga', 'run', 'walk', 'dance'],
      daily: ['commute', 'morning_routine', 'shower', 'getting_ready'],
      work: ['work', 'study', 'creative_work'],
      home: ['clean', 'cook', 'eat'],
      social: ['hang_out', 'party', 'date'],
      relaxation: ['relax', 'read', 'game', 'sleep'],
      transportation: ['drive', 'fly'],
      emotional: ['think', 'cry', 'celebrate']
    };
  }

  /**
   * Get activity attributes for content matching
   */
  public getActivityAttributes(activity: Activity): string[] {
    return this.events[activity] || [];
  }

  /**
   * Get emotion attributes for content matching
   */
  public getEmotionAttributes(emotion: Emotion): string[] {
    return this.emotions[emotion] || [];
  }

  /**
   * Get group dynamic attributes for content matching
   */
  public getGroupDynamicAttributes(groupDynamic: GroupDynamic): string[] {
    return this.groupDynamics[groupDynamic] || [];
  }

  /**
   * Calculate content relevance score based on context
   */
  public calculateRelevanceScore(
    content: ContentItem,
    searchContext: {
      activities: Activity[];
      emotions: Emotion[];
      groupDynamics: GroupDynamic[];
    }
  ): number {
    let score = 0;
    let maxScore = 0;

    // Activity matching (40% weight)
    const activityWeight = 0.4;
    const activityMatches = content.activities.filter(a => 
      searchContext.activities.includes(a)
    ).length;
    const activityScore = activityMatches / Math.max(searchContext.activities.length, 1);
    score += activityScore * activityWeight;
    maxScore += activityWeight;

    // Emotion matching (30% weight)
    const emotionWeight = 0.3;
    const emotionMatches = content.emotions.filter(e => 
      searchContext.emotions.includes(e)
    ).length;
    const emotionScore = emotionMatches / Math.max(searchContext.emotions.length, 1);
    score += emotionScore * emotionWeight;
    maxScore += emotionWeight;

    // Group dynamic matching (30% weight)
    const groupWeight = 0.3;
    const groupMatches = content.groupDynamics.filter(g => 
      searchContext.groupDynamics.includes(g)
    ).length;
    const groupScore = groupMatches / Math.max(searchContext.groupDynamics.length, 1);
    score += groupScore * groupWeight;
    maxScore += groupWeight;

    return maxScore > 0 ? score / maxScore : 0;
  }

  /**
   * Filter content by decade and generation
   */
  public filterByTimeframe(
    content: ContentItem[],
    yearRange?: [number, number],
    decade?: string,
    generation?: string
  ): ContentItem[] {
    return content.filter(item => {
      if (yearRange && item.yearCreated) {
        return item.yearCreated >= yearRange[0] && item.yearCreated <= yearRange[1];
      }
      
      if (decade && item.decade) {
        return item.decade === decade;
      }
      
      if (generation && item.generation) {
        return item.generation === generation;
      }
      
      return true;
    });
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
  }
}

// Singleton instance
export const contextualGenreSystem = new ContextualGenreSystem();