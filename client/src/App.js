import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Viewer from './Viewer';
import Upload from './Upload';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        <header
          style={{
            backgroundColor:'whitesmoke',
            padding: '1rem 2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}
        >
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>
            3D Model App
          </h1>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            {['/', '/upload', '/dashboard'].map((path, i) => {
              const labels = ['Viewer', 'Upload', 'Dashboard'];
              return (
                <NavLink
                  key={path}
                  to={path}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: isActive ? '#ffffff' : '#2563eb',
                    backgroundColor: isActive ? '#2563eb' : '#e0f2fe',
                    padding: '0.5rem 1rem',
                    borderRadius: '999px',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: isActive ? '0 2px 6px rgba(37,99,235,0.4)' : 'none',
                  })}
                >
                  {labels[i]}
                </NavLink>
              );
            })}
          </nav>
        </header>

        <main style={{ padding: '2rem', minHeight: 'calc(100vh - 80px)' }}>
          <Routes>
            <Route path="/" element={<Viewer />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
