# Cinematic TV - Smart TV Streaming Application

A premium streaming application specifically designed for Smart TVs with remote control navigation, optimized for slow internet connections, and featuring real-time movie and TV show data from TMDb API with VidSrc streaming integration.

## 🌟 Features

### Smart TV Optimizations
- **10-Foot UI Design**: Large fonts and interface elements optimized for TV viewing distance
- **Remote Control Navigation**: Full arrow key navigation with spatial focus management
- **Focus Indicators**: Clear visual focus states with red glow effects for easy tracking
- **Dark Theme**: Optimized for low-light TV viewing environments
- **Large Touch Targets**: 48px+ touch targets for remote control compatibility

### Content & Streaming
- **TMDb Integration**: Real-time data from The Movie Database API
- **VidSrc Streaming**: High-quality video streaming with multiple server support
- **Search Functionality**: Search across movies and TV shows
- **Content Categories**: Popular, Top Rated, Trending, and Upcoming content
- **Video Player**: Full-screen video player with remote control support

### Performance Optimizations
- **Slow Internet Support**: Optimized for bandwidth-constrained environments
- **Progressive Loading**: Lazy loading of images and content
- **Service Worker**: Caching strategies for offline functionality
- **Image Optimization**: Compressed images with placeholder fallbacks
- **Background Updates**: Smart caching with background refresh

### Smart Features
- **Spatial Navigation**: Intelligent focus management between UI elements
- **Hero Content**: Featured content with auto-rotating highlights
- **Auto-Continue**: Automatic next episode for TV shows
- **Responsive Design**: Adapts to different TV resolutions (1080p, 4K)
- **Accessibility**: Reduced motion support and keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for API access
- Smart TV or browser-based TV interface

### Installation

1. **Download the Application**
   ```bash
   # Clone or download the project files
   # Ensure all files are in the same directory:
   # - index.html
   # - styles.css
   # - app.js
   # - sw.js (Service Worker)
   ```

2. **Deploy to Web Server**
   ```bash
   # Option 1: Simple HTTP server
   python -m http.server 8000
   
   # Option 2: Node.js server
   npx http-server
   
   # Option 3: Deploy to any web hosting service
   ```

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:8000`
   - For Smart TVs, ensure the TV's browser can access the hosted URL

### API Configuration

The application uses the TMDb API with the provided key:
- **API Key**: `61d95006877f80fb61358dbb78f153c3`
- **Base URL**: `https://api.themoviedb.org/3`
- **Image Base URL**: `https://image.tmdb.org/t/p/w500`

⚠️ **Note**: The provided API key is for development/testing purposes. For production use, please register for your own API key at [TMDb](https://www.themoviedb.org/settings/api).

## 🎮 Remote Control Navigation

### Navigation Keys
- **Arrow Keys**: Navigate between UI elements
- **Enter**: Select/activate focused element
- **Escape/Back**: Go back or close modals
- **Tab**: Switch between major sections

### Navigation Pattern
1. **Sidebar Navigation**: Left/right to expand/collapse, up/down to switch sections
2. **Content Rails**: Left/right to scroll through content, up/down to move between rails
3. **Grid Views**: Arrow keys to navigate grid items
4. **Modals**: Arrow keys to navigate controls, Enter to activate

### Focus Management
- Focus automatically moves to the next logical element
- Visual focus indicators with red glow effects
- Scroll into view for content outside the viewport
- Wrap-around navigation in content lists

## 📱 Sections & Features

### Home Section
- **Hero Content**: Featured movie/show with play and info buttons
- **Trending Rail**: Popular content from the past week
- **Popular Movies**: Currently popular movies
- **Popular TV Shows**: Currently popular television series

### Movies Section
- **Filter Options**: Popular, Top Rated, Upcoming
- **Grid Layout**: Optimized for large screens
- **Movie Details**: Synopsis, ratings, cast, and streaming options

### TV Shows Section
- **Filter Options**: Popular, Top Rated, On Air
- **Episode Support**: Season and episode selection
- **Auto-Continue**: Automatically plays next episodes

### Search Section
- **Global Search**: Search across movies and TV shows
- **Real-time Results**: Live search with 500ms debounce
- **Combined Results**: Movies and TV shows in unified results

## 🎥 Video Streaming

### VidSrc Integration
- **Movie Streaming**: Direct embedding from VidSrc servers
- **TV Show Streaming**: Episode-by-episode viewing
- **Auto-Play Control**: Configurable auto-play settings
- **Multiple Qualities**: Automatic quality selection

### Video Player Features
- **Full-Screen Mode**: Optimized for TV screens
- **Remote Control Support**: Play/pause, seek, volume controls
- **Progress Tracking**: Watch progress and resume capability
- **Error Handling**: Fallback servers for failed streams

### Supported Content
- **Movies**: All movies available in TMDb database
- **TV Shows**: Complete series with season/episode support
- **Quality**: Up to 1080p streaming quality
- **Subtitles**: Multiple subtitle options when available

## ⚡ Performance Optimizations

### Slow Internet Optimization
- **Progressive Loading**: Load critical content first
- **Image Lazy Loading**: Load images as they come into view
- **Cache Management**: Smart caching with background updates
- **Bundle Optimization**: Minified and compressed assets

### Smart TV Performance
- **Hardware Acceleration**: CSS transforms for smooth animations
- **Memory Management**: Efficient DOM manipulation
- **Battery Optimization**: Reduced processing when inactive
- **Network Efficiency**: Minimal API calls and smart caching

### Caching Strategy
- **Static Assets**: Cache HTML, CSS, JS files
- **API Responses**: Cache TMDb API responses with TTL
- **Images**: Cache movie posters and backdrop images
- **Offline Fallback**: Provide cached content when offline

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with Grid and Flexbox
- **JavaScript ES6+**: Modern JavaScript with async/await
- **Service Worker**: Offline functionality and caching
- **TMDb API**: Movie and TV show data
- **VidSrc**: Video streaming integration

### Browser Compatibility
- **Smart TV Browsers**: Samsung Tizen, LG webOS, Android TV
- **Web Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Minimum Requirements**: ES6 support, Fetch API, Service Worker

### File Structure
```
/
├── index.html          # Main application HTML
├── styles.css          # Application styles and themes
├── app.js             # Main application JavaScript
├── sw.js              # Service Worker for caching
└── README.md          # This documentation
```

## 🎯 Usage Examples

### Basic Navigation
1. **Start**: Application loads with Home section focused
2. **Navigate**: Use arrow keys to move between elements
3. **Select**: Press Enter to activate focused element
4. **Search**: Navigate to Search section and type to search

### Content Interaction
1. **Browse Content**: Navigate through content rails
2. **View Details**: Select any movie/show card to view details
3. **Play Content**: Click Play button or press Enter on content
4. **Video Controls**: Use remote controls during playback

### Smart Features
- **Auto-Focus**: Focus automatically moves to relevant elements
- **Focus Memory**: Application remembers navigation context
- **Smooth Transitions**: Animations optimized for TV performance
- **Error Recovery**: Graceful handling of network errors

## 🚨 Troubleshooting

### Common Issues

**Application not loading:**
- Check internet connection
- Verify web server is running
- Ensure JavaScript is enabled

**Remote control not working:**
- Check TV browser keyboard support
- Verify focus is on the application
- Try refreshing the page

**Videos not playing:**
- Check VidSrc server status
- Verify internet connection speed
- Try different content

**Performance issues:**
- Clear browser cache
- Check available memory
- Close other applications

### Performance Tips
- Use Ethernet connection when possible
- Close unnecessary browser tabs
- Keep application updated
- Monitor cache usage in developer tools

## 🔒 Security & Privacy

### Data Usage
- **API Calls**: Real-time requests to TMDb servers
- **Caching**: Local storage of frequently accessed content
- **No Personal Data**: Application doesn't store personal information
- **Secure Connections**: All API calls use HTTPS

### Privacy Considerations
- **No Tracking**: No user analytics or tracking
- **Local Storage**: Only caching for performance
- **API Rate Limits**: Respects TMDb API rate limits
- **No Registration**: No user accounts required

## 📈 Future Enhancements

### Planned Features
- **User Profiles**: Multiple user support
- **Watchlists**: Save content for later viewing
- **Recommendations**: AI-powered content suggestions
- **Parental Controls**: Content filtering options

### Technical Improvements
- **Offline Mode**: Complete offline functionality
- **PWA Features**: Install as native app
- **Voice Control**: Voice command support
- **Analytics**: Usage tracking and optimization

## 📞 Support

### Getting Help
- **Documentation**: Check this README for detailed information
- **Browser Console**: Use developer tools for debugging
- **Network Tab**: Monitor API calls and performance
- **Service Worker**: Check cache status in developer tools

### Known Limitations
- **API Dependency**: Requires active TMDb API access
- **Video Availability**: Depends on VidSrc server availability
- **Browser Support**: Limited to modern browsers with ES6 support
- **Internet Required**: Most features require internet connection

## 📄 License

This application is created for educational and demonstration purposes. Please respect the terms of service of TMDb API and VidSrc when using in production environments.

---

**Built with ❤️ for Smart TV streaming enthusiasts**

*Optimized for Smart TVs, slow internet connections, and premium viewing experiences.*