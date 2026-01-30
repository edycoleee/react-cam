import { useRef, useState, useEffect } from 'react';
import './Writing.css';

function Writing() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      // Set canvas background putih
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Set properti drawing
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  // Fungsi untuk memulai menggambar
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    setIsDrawing(true);
  };

  // Fungsi untuk menggambar
  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    ctx.stroke();
  };

  // Fungsi untuk berhenti menggambar
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Fungsi untuk clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Fungsi untuk ambil gambar dari canvas
  const captureSignature = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
  };

  // Fungsi untuk download gambar
  const downloadSignature = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = `signature-${Date.now()}.png`;
      link.click();
    }
  };

  // Fungsi untuk hapus gambar yang sudah di-capture
  const clearCapturedImage = () => {
    setCapturedImage(null);
  };

  return (
    <div className="writing-container">
      <h1>Tanda Tangan Digital</h1>
      
      <div className="canvas-section">
        <div className="canvas-tools">
          <div className="tool-group">
            <label htmlFor="penColor">Warna Pena:</label>
            <input 
              type="color" 
              id="penColor"
              value={penColor}
              onChange={(e) => setPenColor(e.target.value)}
            />
          </div>
          
          <div className="tool-group">
            <label htmlFor="penWidth">Ketebalan: {penWidth}px</label>
            <input 
              type="range" 
              id="penWidth"
              min="1" 
              max="20" 
              value={penWidth}
              onChange={(e) => setPenWidth(e.target.value)}
            />
          </div>
        </div>

        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="signature-canvas"
          />
          <p className="canvas-hint">✍️ Klik dan drag mouse untuk menggambar tanda tangan</p>
        </div>

        <div className="canvas-controls">
          <button onClick={clearCanvas} className="btn btn-secondary">
            🗑️ Hapus Canvas
          </button>
          <button onClick={captureSignature} className="btn btn-success">
            📸 Ambil Gambar
          </button>
        </div>
      </div>

      {capturedImage && (
        <div className="captured-section">
          <h2>Tanda Tangan Tersimpan</h2>
          <div className="signature-preview">
            <img src={capturedImage} alt="Captured Signature" className="captured-image" />
          </div>
          <div className="captured-controls">
            <button onClick={downloadSignature} className="btn btn-info">
              💾 Download
            </button>
            <button onClick={clearCapturedImage} className="btn btn-danger">
              ❌ Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Writing;
