import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [models, setModels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const modelsPerPage = 10;

  const fetchModels = async () => {
    const res = await fetch('http://localhost:5000/models');
    const data = await res.json();
    setModels(data.reverse());
  };

  const deleteModel = async (id) => {
    if (!window.confirm('Are you sure you want to delete this model?')) return;
    await fetch(`http://localhost:5000/models/${id}`, { method: 'DELETE' });
    fetchModels();
  };

  const formatDateTime = (dateStr, fallbackId) => {
    let date = null;
    if (dateStr) {
      date = new Date(dateStr);
    } else if (fallbackId) {
      const timestamp = parseInt(fallbackId.toString().substring(0, 8), 16) * 1000;
      date = new Date(timestamp);
    }
    return date && !isNaN(date) ? date.toLocaleString() : 'Invalid Date';
  };

  useEffect(() => {
    fetchModels();
  }, []);

  
  const indexOfLastModel = currentPage * modelsPerPage;
  const indexOfFirstModel = indexOfLastModel - modelsPerPage;
  const currentModels = models.slice(indexOfFirstModel, indexOfLastModel);
  const totalPages = Math.ceil(models.length / modelsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '4rem 2rem',
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
        background: 'linear-gradient(to right, #eef2ff, #fdf2f8)',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          fontSize: '3.2rem',
          fontWeight: '800',
          marginBottom: '3rem',
          textAlign: 'center',
          background: 'linear-gradient(to right, #4f46e5, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        3D Model Dashboard
      </h1>

      {models.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', fontSize: '1.3rem' }}>
          No models uploaded yet.
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {currentModels.map((model) => (
              <div
                key={model._id}
                style={{
                  background: '#fff',
                  borderRadius: '1.5rem',
                  padding: '2rem 2.5rem',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)';
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      margin: 0,
                    }}
                  >
                    {model.name || model.originalname}
                  </p>
                  <p
                    style={{
                      color: '#6b7280',
                      marginTop: '6px',
                      fontSize: '1.1rem',
                    }}
                  >
                    Uploaded: {formatDateTime(model.createdAt, model._id)}
                  </p>
                </div>

                <button
                  onClick={() => deleteModel(model._id)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    padding: '0.8rem 1.6rem',
                    borderRadius: '0.8rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#dc2626')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#ef4444')}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '3rem',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                style={{
                  backgroundColor: currentPage === index + 1 ? '#4f46e5' : '#e5e7eb',
                  color: currentPage === index + 1 ? '#fff' : '#374151',
                  border: 'none',
                  borderRadius: '0.6rem',
                  padding: '0.6rem 1.2rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
