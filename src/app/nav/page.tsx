"use client";

export default function NavPage() {
  const containerStyle = {
    padding: '32px',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#3b82f6'
  };

  const cardContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px'
  };

  const cardStyle = {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    border: '1px solid #333',
    padding: '16px',
    transition: 'transform 0.2s',
    cursor: 'pointer'
  };

  const cardHoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
  };

  const cardTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: 'white'
  };

  const cardDescStyle = {
    fontSize: '14px',
    color: '#aaa',
    marginBottom: '16px'
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    width: '100%',
    textAlign: 'center' as const
  };

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>WARMAPPER T3 Navigation</h1>
      
      <div style={cardContainerStyle}>
        <div style={cardStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
             onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
          <h2 style={cardTitleStyle}>Simple Home</h2>
          <p style={cardDescStyle}>Simplified dashboard with inline styles</p>
          <div style={buttonStyle} onClick={() => navigateTo('/')}>Visit</div>
        </div>
        
        <div style={cardStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
             onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
          <h2 style={cardTitleStyle}>Minimal Test</h2>
          <p style={cardDescStyle}>Minimal page with Tailwind classes</p>
          <div style={buttonStyle} onClick={() => navigateTo('/minimal')}>Visit</div>
        </div>
        
        <div style={cardStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
             onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
          <h2 style={cardTitleStyle}>Inline Styles</h2>
          <p style={cardDescStyle}>Test page with React inline styles</p>
          <div style={buttonStyle} onClick={() => navigateTo('/inline')}>Visit</div>
        </div>
        
        <div style={cardStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
             onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
          <h2 style={cardTitleStyle}>CSS Modules</h2>
          <p style={cardDescStyle}>Test page with CSS modules</p>
          <div style={buttonStyle} onClick={() => navigateTo('/direct-css')}>Visit</div>
        </div>
        
        <div style={cardStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
             onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
          <h2 style={cardTitleStyle}>Card Component</h2>
          <p style={cardDescStyle}>Simple card layout with inline styles</p>
          <div style={buttonStyle} onClick={() => navigateTo('/cards')}>Visit</div>
        </div>
        
        <div style={cardStyle} onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
             onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
          <h2 style={cardTitleStyle}>Test Dashboard</h2>
          <p style={cardDescStyle}>Test dashboard with static data</p>
          <div style={buttonStyle} onClick={() => navigateTo('/test')}>Visit</div>
        </div>
      </div>
    </div>
  );
}