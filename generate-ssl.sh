#!/bin/bash

# Script untuk generate SSL certificate dengan mkcert
# untuk Nginx reverse proxy

set -e

echo "🔐 Script Generate SSL Certificate untuk React-Cam"
echo "=================================================="
echo ""

# Cek apakah mkcert sudah terinstall
if ! command -v mkcert &> /dev/null; then
    echo "⚠️  mkcert belum terinstall. Installing mkcert..."
    echo ""
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    sudo apt-get update
    sudo apt-get install -y libnss3-tools wget
    
    # Download mkcert untuk ARM (Raspberry Pi)
    echo "⬇️  Downloading mkcert..."
    ARCH=$(uname -m)
    
    if [ "$ARCH" == "aarch64" ] || [ "$ARCH" == "armv7l" ]; then
        # ARM architecture
        wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-arm
    elif [ "$ARCH" == "x86_64" ]; then
        # x86_64 architecture
        wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
    else
        echo "❌ Unsupported architecture: $ARCH"
        exit 1
    fi
    
    chmod +x mkcert
    sudo mv mkcert /usr/local/bin/
    echo "✅ mkcert installed successfully"
    echo ""
fi

# Install mkcert CA
echo "📜 Installing local CA..."
mkcert -install
echo ""

# Get local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')
echo "🌐 Detected local IP: $LOCAL_IP"
echo ""

# Create certs directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CERTS_DIR="$SCRIPT_DIR/nginx/certs"

mkdir -p "$CERTS_DIR"

# Generate certificate
echo "🔑 Generating SSL certificate..."
echo "   Domains: localhost, $LOCAL_IP, 127.0.0.1"
echo ""

cd "$CERTS_DIR"
mkcert -key-file key.pem -cert-file cert.pem localhost "$LOCAL_IP" 127.0.0.1

echo ""
echo "✅ Certificate generated successfully!"
echo ""
echo "📁 Certificate location:"
echo "   - Certificate: $CERTS_DIR/cert.pem"
echo "   - Key: $CERTS_DIR/key.pem"
echo ""
echo "=================================================="
echo "📱 SETUP CLIENT DEVICES (Optional - untuk no warning)"
echo "=================================================="
echo ""
echo "Untuk membuat certificate trusted di device lain:"
echo ""
echo "1. Copy Root CA dari host ke client device:"
echo "   CA Location: $(mkcert -CAROOT)/rootCA.pem"
echo ""
echo "2. Install di client device:"
echo "   - Android: Settings > Security > Install Certificate"
echo "   - iOS: AirDrop file > Install Profile"
echo "   - Windows: Double click > Install > Trusted Root"
echo "   - macOS: Keychain Access > Import > Always Trust"
echo "   - Linux: sudo cp rootCA.pem /usr/local/share/ca-certificates/mkcert.crt"
echo "           sudo update-ca-certificates"
echo ""
echo "=================================================="
echo "🚀 NEXT STEPS"
echo "=================================================="
echo ""
echo "1. Start Docker Compose:"
echo "   docker compose up -d --build"
echo ""
echo "2. Access your app:"
echo "   https://localhost"
echo "   https://$LOCAL_IP"
echo ""
echo "3. No browser warning! ✨"
echo ""
