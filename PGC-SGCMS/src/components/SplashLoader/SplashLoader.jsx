// src/components/SplashLoader/SplashLoader.jsx
import logoImg from '../../assets/logo.png';

export default function SplashLoader() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0d1b4b 0%, #060e26 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#ffffff',
      padding: '2rem',
      boxSizing: 'border-box',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: 420,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
      }}>
        {/* Animated Outer Ring Logo Container */}
        <div style={{
          background: '#ffffff',
          borderRadius: 24,
          padding: '16px 20px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          animation: 'pulse 2s infinite ease-in-out',
          marginBottom: '.5rem',
        }}>
          <img
            src={logoImg}
            alt="PGC Logo"
            style={{
              width: 80,
              height: 80,
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Headings */}
        <div>
          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            margin: '0 0 0.4rem 0',
            textTransform: 'uppercase',
            color: '#ffffff',
            lineHeight: 1.2,
          }}>
            PUNJAB COLLEGES
          </h1>
          <div style={{
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            Student Growth & Character System
          </div>
          
          {/* Campus Badge */}
          <span style={{
            display: 'inline-block',
            background: 'rgba(200, 16, 46, 0.15)',
            border: '1px solid rgba(200, 16, 46, 0.4)',
            color: '#ff4d4d',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '4px 12px',
            borderRadius: 20,
          }}>
            Sahiwal Campus
          </span>
        </div>

        {/* Loading Progress Bar Container */}
        <div style={{
          width: '100%',
          marginTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.65rem',
        }}>
          <div style={{
            width: '100%',
            height: 4,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: '50%',
              background: 'linear-gradient(90deg, #c8102e, #ff4d4d)',
              borderRadius: 2,
              animation: 'loading-bar 1.5s infinite ease-in-out',
            }} />
          </div>
          <small style={{
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.45)',
            fontWeight: 500,
          }}>
            Syncing secure portal... Please wait
          </small>
        </div>
      </div>

      {/* Embedded CSS for pulse/loading-bar keyframe animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
          50% { transform: scale(1.03); box-shadow: 0 10px 35px rgba(200, 16, 46, 0.25); }
          100% { transform: scale(1); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
        }
        @keyframes loading-bar {
          0% { margin-left: -50%; }
          100% { margin-left: 100%; }
        }
      `}} />
    </div>
  );
}
