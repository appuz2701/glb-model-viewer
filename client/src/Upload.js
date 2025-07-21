import React, { useState } from 'react';
import './App.css'; 

const Upload = () => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a .glb file');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      alert(` Uploaded: ${result.filename}`);
    } catch (err) {
      alert(' Upload failed');
    }
  };

  return (
    <div className="upload-container">
  <form className="upload-card" onSubmit={handleSubmit}>
    <h2 className="upload-title">Upload 3D Model (.glb)</h2>

    <input
      type="file"
      accept=".glb"
      onChange={(e) => setFile(e.target.files[0])}
      className="upload-input"
    />

    <button type="submit" className="upload-button">Upload</button>
  </form>
</div>

  );
};

export default Upload;
