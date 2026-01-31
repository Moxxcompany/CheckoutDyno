export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #101EF7 0%, #4B50E6 50%, #7C5CF0 100%)',
      fontFamily: 'Space Grotesk, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center', 
        color: 'white',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 700 }}>
          Welcome to DynoPay
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem' }}>
          Secure payment solutions for modern businesses
        </p>
        <a 
          href="/pay" 
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            backgroundColor: 'white',
            color: '#444CE7',
            borderRadius: '30px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            transition: 'transform 0.2s ease'
          }}
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
