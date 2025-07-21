import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';


function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} position={[0, -0.8, 0]} />;
}

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString();
};


const ModelCard = ({ model }) => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => containerRef.current && observer.unobserve(containerRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '540px',
        transition: 'all 0.3s ease-in-out',
        cursor: 'grab',
      }}
    >
      {visible ? (
        <Canvas style={{ height: '420px', width: '100%', backgroundColor: 'blanchedalmond' }}>
          <ambientLight />
          <Suspense fallback={null}>
            <Model url={`http://localhost:5000/model/${model.filename}`} />
            <OrbitControls />
          </Suspense>
        </Canvas>
      ) : (
        <img
          src="https://cdn-icons-png.flaticon.com/512/6939/6939492.png"
          alt="loading preview"
          style={{ width: '120px', height: '100px', marginTop: '50px' }}
        />
      )}

      <p style={{ marginTop: '1rem', color: '#444', fontSize: '0.95rem' }}>{model.filename}</p>
      <p style={{ color: '#777', fontSize: '0.85rem' }}>
        Uploaded on: {formatDate(model.createdAt)}
      </p>
    </div>
  );
};


const Viewer = () => {
  const [models, setModels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const modelsPerPage = 6;

  useEffect(() => {
    fetch('http://localhost:5000/models')
      .then((res) => res.json())
      .then((data) => setModels(data.reverse())); 
  }, []);

  const indexOfLastModel = currentPage * modelsPerPage;
  const indexOfFirstModel = indexOfLastModel - modelsPerPage;
  const currentModels = models.slice(indexOfFirstModel, indexOfLastModel);
  const totalPages = Math.ceil(models.length / modelsPerPage);

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'sans-serif',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: '2.8rem',
          marginBottom: '2rem',
          fontWeight: '800',
          background: 'linear-gradient(to right, #3b82f6, #9333ea, #f43f5e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '1px',
        }}
      >
        3D Model Viewer
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        {currentModels.map((model) => (
          <ModelCard key={model._id} model={model} />
        ))}
      </div>

      
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem',
          gap: '1rem',
        }}
      >
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{
            padding: '0.6rem 1.2rem',
            fontSize: '1rem',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            opacity: currentPage === 1 ? 0.6 : 1,
          }}
        >
          Previous
        </button>
        <span style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            padding: '0.6rem 1.2rem',
            fontSize: '1rem',
            backgroundColor: '#9333ea',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            opacity: currentPage === totalPages ? 0.6 : 1,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Viewer;
