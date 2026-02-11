'use client';

import dynamic from 'next/dynamic';

const AppShell = dynamic(() => import('@/components/AppShell'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#06091a',
      color: '#f5a623',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '12px',
      letterSpacing: '2px',
    }}>
      LOADING...
    </div>
  ),
});

export default function Home() {
  return <AppShell />;
}
