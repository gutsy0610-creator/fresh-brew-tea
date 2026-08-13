import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: '홈', icon: '🏠' },
    { path: '/flashcards', label: '암기', icon: '📇' },
    { path: '/solve', label: '풀기', icon: '📝' },
    { path: '/review', label: '오답', icon: '🔄' },
    { path: '/goldenbell', label: '골든벨', icon: '🔔' },
    { path: '/stats', label: '기록', icon: '📊' },
  ];

  return (
    <div className="page-container">
      <header style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--main-dark)', fontSize: '24px' }}>2026 통일골든벨 도전!</h1>
      </header>
      
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <nav className="bottom-bar">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              flex: 1,
              flexDirection: 'column',
              gap: '4px',
              minHeight: '60px',
              padding: '8px 4px',
              backgroundColor: location.pathname === item.path ? 'var(--main-light)' : 'transparent',
              color: location.pathname === item.path ? 'var(--main-dark)' : 'var(--text-muted)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '12px', fontWeight: location.pathname === item.path ? 700 : 500 }}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
