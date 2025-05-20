"use client";

export default function InlineStylePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        marginBottom: '1.5rem', 
        color: 'white' 
      }}>
        Inline Style Test Page
      </h1>
      
      <div style={{ 
        padding: '1rem', 
        backgroundColor: 'blue', 
        color: 'white', 
        borderRadius: '0.5rem', 
        marginBottom: '1rem' 
      }}>
        This is a blue box with white text (using inline styles).
      </div>
      
      <div style={{ 
        padding: '1rem', 
        backgroundColor: 'green', 
        color: 'white', 
        borderRadius: '0.5rem', 
        marginBottom: '1rem' 
      }}>
        This is a green box with white text (using inline styles).
      </div>
      
      <div style={{ 
        padding: '1rem', 
        backgroundColor: 'red', 
        color: 'white', 
        borderRadius: '0.5rem', 
        marginBottom: '1rem' 
      }}>
        This is a red box with white text (using inline styles).
      </div>
      
      <button 
        style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: 'purple', 
          color: 'white', 
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button clicked!')}
      >
        Click Me
      </button>
    </div>
  );
}