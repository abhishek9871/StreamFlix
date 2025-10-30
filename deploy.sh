#!/bin/bash

# Cinematic TV - Smart TV Streaming App Deployment Script
# This script helps you set up and run the Smart TV streaming application

echo "🎬 Cinematic TV - Smart TV Streaming App Deployment"
echo "=================================================="
echo ""

# Check if Python is installed
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python is not installed. Please install Python to run this application."
    exit 1
fi

# Check if Node.js is installed for alternative server
if command -v node &> /dev/null; then
    NODE_AVAILABLE=true
else
    NODE_AVAILABLE=false
fi

echo "✅ Python found: $PYTHON_CMD"
if [ "$NODE_AVAILABLE" = true ]; then
    echo "✅ Node.js found for alternative server"
else
    echo "⚠️  Node.js not found - using Python server only"
fi
echo ""

# Create a simple start script
cat > start-server.sh << 'EOF'
#!/bin/bash

echo "🎬 Starting Cinematic TV Streaming App..."
echo ""

# Function to kill existing servers
kill_existing_servers() {
    echo "🛑 Stopping any existing servers..."
    pkill -f "python.*http.server" 2>/dev/null || true
    pkill -f "npx.*http-server" 2>/dev/null || true
    pkill -f "node.*http-server" 2>/dev/null || true
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Kill existing servers
kill_existing_servers

# Try different ports
PORTS=(8000 8080 3000 5000)
SELECTED_PORT=""

for port in "${PORTS[@]}"; do
    if ! check_port $port; then
        SELECTED_PORT=$port
        break
    fi
done

if [ -z "$SELECTED_PORT" ]; then
    echo "❌ All common ports are in use. Please stop other services or use a different port."
    exit 1
fi

echo "🚀 Starting server on port $SELECTED_PORT..."
echo ""

# Try Node.js server first if available
if command -v node &> /dev/null && command -v npx &> /dev/null; then
    echo "📡 Using Node.js HTTP server..."
    echo ""
    echo "🌐 Your Cinematic TV app will be available at:"
    echo "   http://localhost:$SELECTED_PORT"
    echo ""
    echo "📱 For Smart TV access:"
    echo "   1. Find your computer's IP address"
    echo "   2. On your Smart TV, visit: http://[YOUR-IP]:$SELECTED_PORT"
    echo ""
    echo "⏹️  Press Ctrl+C to stop the server"
    echo ""
    npx http-server . -p $SELECTED_PORT -c-1 --cors
elif command -v python3 &> /dev/null; then
    echo "📡 Using Python HTTP server..."
    echo ""
    echo "🌐 Your Cinematic TV app will be available at:"
    echo "   http://localhost:$SELECTED_PORT"
    echo ""
    echo "📱 For Smart TV access:"
    echo "   1. Find your computer's IP address"
    echo "   2. On your Smart TV, visit: http://[YOUR-IP]:$SELECTED_PORT"
    echo ""
    echo "⏹️  Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server $SELECTED_PORT
elif command -v python &> /dev/null; then
    echo "📡 Using Python HTTP server..."
    echo ""
    echo "🌐 Your Cinematic TV app will be available at:"
    echo "   http://localhost:$SELECTED_PORT"
    echo ""
    echo "📱 For Smart TV access:"
    echo "   1. Find your computer's IP address"
    echo "   2. On your Smart TV, visit: http://[YOUR-IP]:$SELECTED_PORT"
    echo ""
    echo "⏹️  Press Ctrl+C to stop the server"
    echo ""
    python -m http.server $SELECTED_PORT
else
    echo "❌ No suitable server found. Please install Python or Node.js."
    exit 1
fi
EOF

# Make the script executable
chmod +x start-server.sh

echo "✅ Setup complete!"
echo ""
echo "📁 Files created:"
echo "   - start-server.sh (deployment script)"
echo ""
echo "🚀 To start the application:"
echo "   ./start-server.sh"
echo ""
echo "📖 Or manually:"
echo "   Python: python3 -m http.server 8000"
echo "   Node.js: npx http-server"
echo ""
echo "📱 Smart TV Setup Instructions:"
echo "   1. Start the server on your computer"
echo "   2. Find your computer's IP address:"
echo "      - Windows: ipconfig"
echo "      - Mac/Linux: ifconfig or ip addr"
echo "   3. On your Smart TV browser, visit:"
echo "      http://[YOUR-COMPUTER-IP]:8000"
echo ""
echo "🎮 Remote Control Navigation:"
echo "   - Use arrow keys to navigate"
echo "   - Press Enter to select"
echo "   - Use Escape/Back to go back"
echo ""
echo "✨ Features included:"
echo "   ✅ Smart TV optimized UI (10-foot interface)"
echo "   ✅ Remote control navigation"
echo "   ✅ TMDb API integration"
echo "   ✅ VidSrc streaming support"
echo "   ✅ Slow internet optimization"
echo "   ✅ Progressive loading"
echo "   ✅ Service Worker caching"
echo "   ✅ PWA support"
echo ""
echo "🎯 Ready to stream! Run ./start-server.sh to begin."