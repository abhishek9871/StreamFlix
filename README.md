# 🎬 StreamFlix - Smart TV Streaming Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](https://github.com/abhishek9871/StreamFlix)
[![Platform](https://img.shields.io/badge/Platform-Smart%20TV%20%7C%20Web-green.svg)](https://github.com/abhishek9871/StreamFlix)

StreamFlix is a modern, Smart TV-optimized streaming platform built specifically for television browsers with remote control navigation. It provides seamless access to movies and TV shows with an intuitive 10-foot UI design perfect for living room viewing.

## ✨ Features

### 🎯 Smart TV Optimized
- **10-Foot UI Design**: Optimized for viewing from 10 feet away on television screens
- **Remote Control Navigation**: Full keyboard and remote control support
- **Large Touch Targets**: Easy navigation with TV remotes
- **High Contrast Interface**: Pure black background with vibrant red accents
- **Focused Visual Indicators**: Clear red glow effects for active elements

### 🎭 Content Discovery
- **TMDb Integration**: Real-time access to The Movie Database
- **Trending Content**: Discover what's popular across all media
- **Popular Movies**: Browse trending and popular films
- **Popular TV Shows**: Explore popular television series
- **Search Functionality**: Find specific movies and shows
- **Content Filtering**: Filter by genre, year, and rating

### 🚀 Performance & Optimization
- **Slow Internet Support**: Optimized for unreliable or slow connections
- **Service Worker**: Offline functionality and smart caching
- **Lazy Loading**: Images load only when needed
- **Progressive Enhancement**: Works on all devices and browsers
- **PWA Support**: Install as native app on compatible devices

### 🎮 User Experience
- **Spatial Navigation**: Intelligent focus management between UI elements
- **Keyboard Shortcuts**: Full keyboard accessibility
- **Modal System**: Rich detail views and video players
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes for extended viewing

## 🏗️ Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **API**: The Movie Database (TMDb) API v3
- **Streaming**: VidSrc.cc embed provider
- **PWA**: Progressive Web App with Service Worker
- **Styling**: Pure CSS with custom design system
- **Icons**: Emoji-based iconography for universal compatibility

## 📱 Supported Devices

### Smart TVs
- Samsung Smart TV (2015+)
- LG Smart TV (WebOS)
- Sony Smart TV (Android TV)
- TCL Smart TV (Roku OS)
- Hisense Smart TV
- Android TV devices
- Fire TV Stick 4K

### Web Browsers
- Chrome (60+)
- Firefox (55+)
- Safari (12+)
- Edge (79+)
- Samsung Internet (8+)
- Opera (47+)

### Other Devices
- Desktop/Laptop computers
- Tablets (iPad, Android tablets)
- Mobile phones (responsive design)
- Projectors with smart capabilities

## 🚀 Quick Start

### Prerequisites
- Modern web browser
- Internet connection
- TMDb API key (free from [themoviedb.org](https://www.themoviedb.org/))

### Installation Options

#### Option 1: Direct Web Access
1. Visit the live application: [https://rgsq2s85zn5j.space.minimax.io](https://rgsq2s85zn5j.space.minimax.io)
2. No installation required - works directly in your browser

#### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/abhishek9871/StreamFlix.git
cd StreamFlix

# Start local server
python3 -m http.server 8000
# or
npx http-server

# Access at http://localhost:8000
```

#### Option 3: Deploy to Your Own Server
```bash
# Upload all files to your web server
# Ensure HTTPS for PWA features
# Access via your domain
```

## 🎮 Navigation Guide

### Remote Control Keys
- **Arrow Keys**: Navigate between content items
- **Enter**: Select movies/shows or play videos
- **Escape/Back**: Close modals and return to previous screens
- **Home**: Return to main dashboard

### Keyboard Shortcuts (Desktop)
- **Arrow Keys**: Navigate content
- **Enter**: Activate focused element
- **Escape**: Close modal/player
- **H**: Go to Home
- **M**: Go to Movies
- **T**: Go to TV Shows
- **S**: Focus search input
- **/**: Quick search

## 📡 API Integration

### TMDb API Configuration
The application uses TMDb (The Movie Database) for content metadata:

```javascript
// API Configuration
const TMDB_API_KEY = '61d95006877f80fb61358dbb78f153c3';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
```

### Endpoints Used
- `/trending/all/week` - Trending content
- `/movie/popular` - Popular movies
- `/tv/popular` - Popular TV shows
- `/movie/top_rated` - Top rated movies
- `/tv/top_rated` - Top rated TV shows
- `/search/movie` - Movie search
- `/search/tv` - TV show search

### VidSrc Streaming
Movies and TV shows are streamed via VidSrc.cc:
- Movies: `https://vidsrc.cc/v2/embed/movie/{tmdbId}`
- TV Shows: `https://vidsrc.cc/v2/embed/tv/{tmdbId}/{season}/{episode}`

## 🎨 Design System

### Color Palette
```css
--primary-500: #E50914;     /* Netflix Red */
--background-base: #000000;  /* Pure Black */
--surface-layer-1: #141414;  /* Dark Gray */
--surface-layer-2: #1f1f1f;  /* Lighter Gray */
--text-primary: #ffffff;     /* White Text */
--text-secondary: #b3b3b3;   /* Gray Text */
```

### Typography
- **Font Family**: Poppins (fallback: sans-serif)
- **Size Range**: 16px (small) to 80px (hero)
- **Weight Range**: 300 (light) to 700 (bold)

### Spacing System
- **Base Unit**: 8px
- **Scale**: 8px, 16px, 24px, 32px, 48px, 64px, 96px

### Focus States
- **Glow Effect**: `box-shadow: 0 0 24px 8px rgba(229, 9, 20, 0.7)`
- **Scale Transform**: `transform: scale(1.05)`
- **Transition**: `transition: all 0.3s ease`

## 🔧 Configuration

### Environment Variables
No environment variables required - all configuration is client-side.

### Customization Options
1. **API Key**: Change TMDb API key in `app.js`
2. **Streaming Provider**: Modify VidSrc URLs in streaming functions
3. **Colors**: Update CSS custom properties in `:root`
4. **Content Sections**: Modify content loading functions

## 📱 PWA Installation

### Installation Steps
1. Visit the application in a compatible browser
2. Look for the "Install" prompt or "Add to Home Screen"
3. Follow browser-specific installation instructions
4. Launch from your device's app menu

### PWA Features
- **Offline Support**: Basic functionality works offline
- **App Shortcuts**: Quick access to Home, Movies, TV Shows
- **Fullscreen Mode**: Immersive viewing experience
- **Background Sync**: Content updates in background

## 🔒 Security & Privacy

### Data Handling
- **No User Data Collection**: Application does not store personal information
- **No Tracking**: No analytics or user tracking implemented
- **API Security**: TMDb API key is client-side (review your usage limits)
- **Secure Streaming**: All streaming goes through HTTPS

### CORS & Permissions
- **API Calls**: Direct TMDb API integration
- **No Server Required**: Completely client-side application
- **No Cookies**: No persistent storage except service worker cache

## 🐛 Troubleshooting

### Common Issues

#### Content Not Loading
- **Check Internet Connection**: Ensure stable internet access
- **API Limits**: TMDb has rate limits - wait and retry
- **Browser Cache**: Clear cache and reload
- **Console Errors**: Check browser developer console

#### Video Playback Issues
- **VidSrc Availability**: Some content may be unavailable
- **Browser Compatibility**: Try different browser
- **Ad Blockers**: Disable ad blockers for streaming
- **Network Issues**: Check network stability

#### Navigation Problems
- **Focus Issues**: Refresh page to reset focus
- **Remote Control**: Ensure remote is paired and working
- **Keyboard Events**: Check if keyboard events are captured

#### Performance Issues
- **Slow Loading**: Check internet speed
- **Memory Usage**: Close other tabs
- **Cache Clearing**: Clear service worker cache
- **Device Restart**: Restart device if persistent issues

### Diagnostic Steps
1. Open browser developer console (F12)
2. Check for JavaScript errors
3. Verify network requests in Network tab
4. Test with different browser
5. Check TMDb API status
6. Verify VidSrc availability

## 🤝 Contributing

### Development Setup
```bash
# Fork the repository
# Clone your fork
git clone https://github.com/yourusername/StreamFlix.git
cd StreamFlix

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
# Commit changes
git commit -m 'Add amazing feature'

# Push to your fork
git push origin feature/amazing-feature

# Create Pull Request
```

### Contribution Guidelines
1. **Code Style**: Follow existing code formatting
2. **Testing**: Test on multiple devices/browsers
3. **Documentation**: Update README if needed
4. **Performance**: Maintain slow internet optimization
5. **Accessibility**: Ensure remote control compatibility

### Areas for Contribution
- Additional streaming providers
- More content filtering options
- User profiles and watchlists
- Parental controls
- Additional languages
- Enhanced PWA features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **The Movie Database (TMDb)** for providing excellent movie/TV APIs
- **VidSrc.cc** for streaming video content
- **Netflix** for inspiring modern streaming UI/UX
- **Web Standards Community** for PWA and accessibility guidelines

## 📞 Support

### Getting Help
- **Issues**: [GitHub Issues](https://github.com/abhishek9871/StreamFlix/issues)
- **Discussions**: [GitHub Discussions](https://github.com/abhishek9871/StreamFlix/discussions)
- **Documentation**: This README file
- **API Docs**: [TMDb API Documentation](https://developers.themoviedb.org/3)

### Reporting Bugs
Please use GitHub Issues with:
- Device type and model
- Browser version
- Steps to reproduce
- Expected vs actual behavior
- Console error messages (if any)

### Feature Requests
Use GitHub Issues with:
- Clear description of the feature
- Use case and benefits
- Implementation suggestions (optional)
- Mockups or examples (if applicable)

## 🗺️ Roadmap

### Version 1.1 (Planned)
- [ ] Multiple streaming providers
- [ ] User watchlists
- [ ] Content recommendations
- [ ] Multiple language support

### Version 1.2 (Planned)
- [ ] User profiles
- [ ] Parental controls
- [ ] Content download for offline
- [ ] Advanced search filters

### Version 2.0 (Future)
- [ ] Live TV streaming
- [ ] Sports content
- [ ] News integration
- [ ] Social features

## 📊 Project Statistics

- **Lines of Code**: ~1,900 (HTML, CSS, JavaScript)
- **File Size**: <1MB (excluding dependencies)
- **Dependencies**: 0 external libraries
- **Browser Support**: Modern browsers (2018+)
- **Device Compatibility**: All web-enabled devices

---

## 🌟 Star History

If you find this project helpful, please consider giving it a star on GitHub!

---

**Made with ❤️ for Smart TV streaming enthusiasts**

*Last updated: October 30, 2025*