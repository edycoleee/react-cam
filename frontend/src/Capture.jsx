import { useRef, useState } from 'react';
import './Capture.css';

function Capture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState('');

  // Fungsi untuk membuka kamera
  const openCamera = async () => {
    try {
      // Cek apakah browser mendukung getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError(
          '❌ Browser tidak mendukung akses kamera atau halaman tidak aman. ' +
          'Pastikan menggunakan HTTPS atau localhost untuk mengakses kamera.'
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError('');
      }
    } catch (err) {
      let errorMessage = 'Tidak dapat mengakses kamera: ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Izin akses kamera ditolak. Silakan izinkan akses kamera.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'Kamera tidak ditemukan.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Kamera sedang digunakan aplikasi lain.';
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      console.error('Error accessing camera:', err);
    }
  };

  // Fungsi untuk menutup kamera
  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  // Fungsi untuk capture gambar
  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      
      const imageData = canvasRef.current.toDataURL('image/png');
      setCapturedImage(imageData);
    }
  };

  // Fungsi untuk download gambar
  const downloadImage = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = `capture-${Date.now()}.png`;
      link.click();
    }
  };

  // Fungsi untuk clear captured image
  const clearImage = () => {
    setCapturedImage(null);
  };

  return (
    <div className="capture-container">
      <h1>Camera Capture</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="video-container">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline
          className={isStreaming ? 'active' : 'inactive'}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="controls">
        {!isStreaming ? (
          <button onClick={openCamera} className="btn btn-primary">
            📷 Buka Kamera
          </button>
        ) : (
          <>
            <button onClick={captureImage} className="btn btn-success">
              📸 Ambil Foto
            </button>
            <button onClick={closeCamera} className="btn btn-danger">
              ❌ Tutup Kamera
            </button>
          </>
        )}
      </div>

      {capturedImage && (
        <div className="captured-section">
          <h2>Foto Hasil Capture</h2>
          <img src={capturedImage} alt="Captured" className="captured-image" />
          <div className="captured-controls">
            <button onClick={downloadImage} className="btn btn-info">
              💾 Download
            </button>
            <button onClick={clearImage} className="btn btn-secondary">
              🗑️ Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Capture;
