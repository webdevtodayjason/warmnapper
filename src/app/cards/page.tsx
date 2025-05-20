"use client";

export default function SimpleCardPage() {
  const cardStyle = {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    border: '1px solid #333',
    padding: '16px',
    marginBottom: '16px',
    color: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const cardHeaderStyle = {
    borderBottom: '1px solid #333',
    paddingBottom: '12px',
    marginBottom: '12px'
  };

  const cardTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0
  };

  const statValueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '4px'
  };

  const statDescStyle = {
    fontSize: '14px',
    color: '#aaa'
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Simple Card Test</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Total Networks</h3>
          </div>
          <div>
            <div style={statValueStyle}>34</div>
            <div style={statDescStyle}>WiFi networks detected</div>
          </div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Unique Networks</h3>
          </div>
          <div>
            <div style={statValueStyle}>18</div>
            <div style={statDescStyle}>Unique SSIDs found</div>
          </div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Open Networks</h3>
          </div>
          <div>
            <div style={statValueStyle}>17.6%</div>
            <div style={statDescStyle}>6 networks without security</div>
          </div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Average Signal</h3>
          </div>
          <div>
            <div style={statValueStyle}>-81.4 dBm</div>
            <div style={statDescStyle}>Avg. RSSI value</div>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <div style={{ ...cardStyle, height: '300px' }}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Authentication Types</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px', backgroundColor: '#1a1a1a', borderRadius: '4px' }}>
            <p>Chart would appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}