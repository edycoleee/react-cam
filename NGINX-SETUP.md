# Nginx + mkcert SSL Setup untuk React-Cam

Setup ini menggunakan Nginx sebagai reverse proxy dengan SSL certificate yang di-generate oleh mkcert untuk trusted local HTTPS.

## 📁 Struktur File

```
react-cam/
├── docker-compose.yml          # Docker compose dengan Nginx
├── generate-ssl.sh             # Script untuk generate SSL certificate
├── frontend/                   # React app
│   ├── Dockerfile
│   ├── vite.config.js         # Tanpa basicSsl (SSL di Nginx)
│   └── ...
└── nginx/
    ├── nginx.conf             # Nginx configuration
    └── certs/                 # SSL certificates (auto-generated)
        ├── cert.pem
        └── key.pem
```

## 🚀 Cara Setup

### 1. Generate SSL Certificate

Jalankan script untuk install mkcert dan generate certificate:

```bash
./generate-ssl.sh
```

Script akan:
- ✅ Install mkcert (jika belum ada)
- ✅ Generate trusted SSL certificate untuk localhost dan IP lokal
- ✅ Simpan certificate di `nginx/certs/`

### 2. Start Docker Compose

```bash
docker compose down
docker compose up -d --build
```

### 3. Akses Aplikasi

**Tanpa browser warning!**

- https://localhost
- https://192.168.30.21

## 🔐 Setup Client Devices (Optional)

Agar certificate trusted di semua device (HP, tablet, laptop lain), install Root CA:

### 1. Copy Root CA dari server

```bash
# Cek lokasi CA
mkcert -CAROOT

# Akan tampil lokasi, misalnya: /home/sultan/.local/share/mkcert
# Copy file rootCA.pem ke device lain
```

### 2. Install di masing-masing device:

**📱 Android:**
1. Transfer `rootCA.pem` ke HP
2. Settings > Security > Install Certificate
3. Pilih "CA Certificate"
4. Browse dan pilih `rootCA.pem`

**📱 iOS/iPadOS:**
1. AirDrop `rootCA.pem` ke device
2. Settings > Profile Downloaded > Install
3. Settings > General > About > Certificate Trust Settings
4. Enable trust untuk mkcert CA

**💻 Windows:**
1. Double click `rootCA.pem`
2. Install Certificate > Local Machine
3. Place in: "Trusted Root Certification Authorities"

**💻 macOS:**
1. Double click `rootCA.pem`
2. Keychain Access akan terbuka
3. Double click certificate > Trust > Always Trust

**🐧 Linux:**
```bash
sudo cp rootCA.pem /usr/local/share/ca-certificates/mkcert.crt
sudo update-ca-certificates
```

## 🔧 Konfigurasi

### Nginx (nginx/nginx.conf)
- ✅ Auto redirect HTTP → HTTPS
- ✅ Reverse proxy ke React app
- ✅ WebSocket support
- ✅ Security headers
- ✅ Gzip compression

### Docker Compose
- ✅ React app (port 4173 internal)
- ✅ Nginx (port 443 HTTPS, 80 HTTP)
- ✅ Auto restart

## 🛠️ Troubleshooting

### Certificate Error
```bash
# Re-generate certificate
rm -rf nginx/certs/*
./generate-ssl.sh
docker compose restart nginx
```

### Nginx Error
```bash
# Check logs
docker logs nginx-proxy

# Test config
docker exec nginx-proxy nginx -t
```

### Port Already in Use
```bash
# Check apa yang pakai port 443
sudo lsof -i :443

# Atau ubah port di docker-compose.yml
ports:
  - "8443:443"  # Ganti 443 jadi 8443
```

## 📊 Ports

- **80** - HTTP (redirect ke HTTPS)
- **443** - HTTPS (Nginx → React)
- **4173** - Internal React app (tidak exposed)

## ✨ Keuntungan Setup Ini

✅ No browser warning (trusted certificate)
✅ Production-ready architecture
✅ Mudah scale (bisa tambah backend di nginx)
✅ SSL termination di Nginx
✅ Bisa tambah caching, rate limiting, etc.

## 📝 Notes

- Certificate valid untuk: `localhost`, `127.0.0.1`, dan IP lokal Anda
- Jika IP berubah, jalankan ulang `./generate-ssl.sh`
- Root CA hanya perlu install sekali per device
- Certificate otomatis trusted di host machine
