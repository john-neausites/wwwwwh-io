# wwwwwh.io

A multi-format data access platform with Y2K Core design principles.

## Features

- **Hierarchical Navigation**: Tree-based content organization
- **Fine Art Gallery**: National Gallery of Art integration with full-screen viewing
- **Y2K Core Design**: Minimalist aesthetic with JetBrains Mono typography
- **Mobile Responsive**: Optimized for all devices
- **Static Architecture**: Fast, reliable performance

## Local Development

```bash
python3 -m http.server 8000
```

Then visit: http://localhost:8000

## Deployment

This project is configured for Vercel deployment:

```bash
vercel --prod
```

## Architecture

- **HOW**: Protocol access methods in top navigation
- **WHAT**: Left sidebar tree navigation (1/3 width)  
- **WHY**: Right content area (2/3 width)

Built with vanilla HTML, CSS, and JavaScript.

## Fine Art Gallery

Navigate to **Media → Photo → Fine Art** to experience:
- 8 curated masterpieces
- Full-screen modal viewing
- Zoom and pan functionality
- Mobile touch gestures
- Keyboard navigation

## Technical Stack

- Vanilla JavaScript (ES6+)
- CSS Grid & Flexbox
- SQLite database
- Static file architecture
- Vercel deployment ready