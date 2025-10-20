import { useState, useEffect } from 'react';

interface SessionData {
  sessionId: string;
  data: any;
  server: string;
  timestamp: string;
}

interface HealthStatus {
  status: string;
  server: string;
  checks: {
    redis: boolean;
    mysql: boolean;
  };
}

export default function Home() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSession();
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/session');
      const data = await res.json();
      setSession(data);
      setCounter(data.data?.counter || 0);
    } catch (error) {
      console.error('Failed to fetch session:', error);
    }
  };

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch (error) {
      console.error('Failed to fetch health:', error);
    }
  };

  const updateSession = async () => {
    setLoading(true);
    const newCounter = counter + 1;
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counter: newCounter }),
      });
      const data = await res.json();
      setCounter(newCounter);
      await fetchSession();
    } catch (error) {
      console.error('Failed to update session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>High Availability Web Application</h1>
      
      <div style={styles.card}>
        <h2>Server Information</h2>
        <p><strong>Server Name:</strong> {session?.server || 'Loading...'}</p>
        <p><strong>Session ID:</strong> {session?.sessionId || 'Loading...'}</p>
        <p><strong>Timestamp:</strong> {session?.timestamp || 'Loading...'}</p>
      </div>

      <div style={styles.card}>
        <h2>Session Counter</h2>
        <p style={styles.counter}>{counter}</p>
        <button 
          onClick={updateSession} 
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Updating...' : 'Increment Counter'}
        </button>
        <p style={styles.note}>
          Counter is stored in Redis and shared across all instances
        </p>
      </div>

      <div style={styles.card}>
        <h2>Health Status</h2>
        <p>
          <strong>Overall:</strong> 
          <span style={{
            color: health?.status === 'healthy' ? 'green' : 'orange',
            marginLeft: '10px'
          }}>
            {health?.status || 'Checking...'}
          </span>
        </p>
        <p>
          <strong>Redis:</strong> 
          <span style={{
            color: health?.checks?.redis ? 'green' : 'red',
            marginLeft: '10px'
          }}>
            {health?.checks?.redis ? '✓ Connected' : '✗ Disconnected'}
          </span>
        </p>
        <p>
          <strong>MySQL:</strong> 
          <span style={{
            color: health?.checks?.mysql ? 'green' : 'red',
            marginLeft: '10px'
          }}>
            {health?.checks?.mysql ? '✓ Connected' : '✗ Disconnected'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center' as const,
    color: '#333',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  counter: {
    fontSize: '48px',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    color: '#2196F3',
    margin: '20px 0',
  },
  button: {
    display: 'block',
    margin: '0 auto',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  note: {
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '14px',
    marginTop: '10px',
  },
};