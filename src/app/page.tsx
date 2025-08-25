// src/app/page.tsx
// FINAL VERSION - BASIC HOME PAGE WITH BUTTON
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import React from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  button: { padding: '8px 16px', borderRadius: '8px', color: 'white', textDecoration: 'none' },
  greenButton: { backgroundColor: '#16a34a' },
  grayButton: { backgroundColor: '#4b5563' },
  blueButton: { backgroundColor: '#2563eb', width: '100%', marginTop: '16px', border: 'none', fontSize: '16px', cursor: 'pointer' },
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px', backgroundColor: '#111827', color: 'white' },
  header: { width: '100%', maxWidth: '896px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  nav: { display: 'flex', gap: '16px' },
  formContainer: { width: '100%', maxWidth: '672px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  textarea: { width: '100%', padding: '16px', borderRadius: '8px', backgroundColor: '#1f2937', border: '1px solid #374151', color: 'white' },
  responseBox: { marginTop: '32px', padding: '24px', width: '100%', backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151' }
};

function AuthStatus() {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('auth') === 'success') setIsConnected(true);
  }, []);
  if (isConnected) {
    return <div style={{ ...styles.button, ...styles.greenButton }}>✓ Calendar Connected</div>;
  }
  return <a href="/api/auth/google/signin" style={{ ...styles.button, ...styles.grayButton }}>Connect Google Calendar</a>;
}

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError(''); setResponse('');
    try {
      const res = await fetch('/api/v2', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || 'An error occurred.');
      setResponse(data.response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <nav style={styles.nav}>
        </nav>
        <AuthStatus />
      </header>
      <div style={styles.formContainer}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '32px' }}>Nexus AI Assistant</h1>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <textarea
            value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your command..."
            style={styles.textarea} rows={4}
          />
          <button type="submit" disabled={isLoading} style={styles.blueButton}>
            {isLoading ? 'Processing...' : 'Execute Task'}
          </button>
        </form>
        {response && <div style={styles.responseBox}><h2 style={{fontSize: '20px', fontWeight: 'bold'}}>Response:</h2><p style={{whiteSpace: 'pre-wrap'}}>{response}</p></div>}
        {error && <div style={{...styles.responseBox, backgroundColor: '#450a0a'}}><h2 style={{fontSize: '20px', fontWeight: 'bold'}}>Error:</h2><p>{error}</p></div>}
      </div>
    </main>
  );
}