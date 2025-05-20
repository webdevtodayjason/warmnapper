"use client";

export default function SimpleHomePage() {
  const containerStyle = {
    padding: '20px',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: 'white'
  };

  const headerStyle = {
    padding: '16px 0',
    borderBottom: '1px solid #333',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const logoStyle = {
    fontSize: '24px',
    fontWeight: 'bold'
  };

  const cardContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  };

  const cardStyle = {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    border: '1px solid #333',
    padding: '16px',
    color: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '12px',
    borderBottom: '1px solid #333',
    marginBottom: '12px'
  };

  const cardTitleStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    margin: 0
  };

  const statValueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '4px'
  };

  const statDescStyle = {
    fontSize: '12px',
    color: '#aaa'
  };

  const chartCardStyle = {
    ...cardStyle,
    height: '350px'
  };

  const chartPlaceholderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '280px',
    backgroundColor: '#1a1a1a',
    borderRadius: '4px',
    marginTop: '16px'
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={logoStyle}>
          <span style={{ color: '#3b82f6' }}>WAR</span>MAPPER
        </div>
        <button style={buttonStyle}>Upload WiFi Data</button>
      </header>

      <div style={cardContainerStyle}>
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Total Networks</div>
            <span>📡</span>
          </div>
          <div>
            <div style={statValueStyle}>34</div>
            <div style={statDescStyle}>WiFi networks detected</div>
          </div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Unique Networks</div>
            <span>🔄</span>
          </div>
          <div>
            <div style={statValueStyle}>18</div>
            <div style={statDescStyle}>Unique SSIDs found</div>
          </div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Open Networks</div>
            <span>🔓</span>
          </div>
          <div>
            <div style={statValueStyle}>17.6%</div>
            <div style={statDescStyle}>6 networks without security</div>
          </div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Average Signal</div>
            <span>📶</span>
          </div>
          <div>
            <div style={statValueStyle}>-81.4 dBm</div>
            <div style={statDescStyle}>Avg. RSSI value</div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={chartCardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Authentication Types</div>
          </div>
          <div style={chartPlaceholderStyle}>
            <p>Pie Chart</p>
          </div>
        </div>
        
        <div style={chartCardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Channel Distribution</div>
          </div>
          <div style={chartPlaceholderStyle}>
            <p>Bar Chart</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={chartCardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Security Levels</div>
          </div>
          <div style={chartPlaceholderStyle}>
            <p>Pie Chart</p>
          </div>
        </div>
        
        <div style={chartCardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>Signal Strength</div>
          </div>
          <div style={chartPlaceholderStyle}>
            <p>Pie Chart</p>
          </div>
        </div>
      </div>
    </div>
  );
}