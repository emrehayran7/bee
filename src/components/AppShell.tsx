// Force rebuild
'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import Header from '@/components/layout/Header';
import ToastContainer from '@/components/ui/ToastContainer';
import Landing from '@/components/landing/Landing';
import Dashboard from '@/components/dashboard/Dashboard';
import BeeShop from '@/components/shop/BeeShop';
import AccountModal from '@/components/modals/AccountModal';
import UpgradeHiveModal from '@/components/modals/UpgradeHiveModal';
import InitializeModal from '@/components/modals/InitializeModal';
import GameProvider from '@/providers/GameProvider';
import Web3Provider from '@/providers/Web3Provider';

type ActiveModal = 'none' | 'account' | 'upgrade' | 'initialize';
type ActivePage = 'home' | 'about' | 'hive' | 'bees';

function AppContent() {
    const connected = useGameStore((s) => s.connected);
    const initialized = useGameStore((s) => s.initialized);
    const [activeModal, setActiveModal] = useState<ActiveModal>('none');
    const [activePage, setActivePage] = useState<ActivePage>('home');

    const handleTabChange = (tab: string) => {
        setActivePage(tab as ActivePage);
    };

    // If not connected, show landing
    if (!connected) {
        return (
            <>
                <Header
                    activeTab={activePage}
                    onTabChange={handleTabChange}
                    onAccountClick={() => { }}
                />
                <Landing />
                <ToastContainer />
            </>
        );
    }

    // If connected but not initialized, show initialize modal
    if (!initialized) {
        return (
            <>
                <Header
                    activeTab={activePage}
                    onTabChange={handleTabChange}
                    onAccountClick={() => setActiveModal('account')}
                />
                <InitializeModal onClose={() => { }} />
                {activeModal === 'account' && (
                    <AccountModal onClose={() => setActiveModal('none')} />
                )}
                <ToastContainer />
            </>
        );
    }

    // Connected + initialized → show dashboard or shop
    return (
        <>
            <Header
                activeTab={activePage}
                onTabChange={handleTabChange}
                onAccountClick={() => setActiveModal('account')}
            />

            {/* Dashboard View */}
            {(activePage === 'home' || activePage === 'hive') && (
                <Dashboard
                    onUpgradeHive={() => setActiveModal('upgrade')}
                    onOpenShop={() => setActivePage('bees')}
                />
            )}

            {activePage === 'bees' && <BeeShop />}

            {activePage === 'about' && (
                <div style={{
                    padding: 'var(--space-2xl)',
                    maxWidth: '800px',
                    margin: '0 auto',
                    animation: 'fadeIn 0.5s var(--ease-out)',
                }}>
                    <div className="pixel-card">
                        <h2 style={{ fontSize: '14px', color: 'var(--text-accent)', marginBottom: 'var(--space-lg)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            About HoneyBee
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            <p style={{ fontSize: '9px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                HoneyBee is a decentralized honey production game on the blockchain.
                                Buy bees, upgrade your hive, and produce $HONEY tokens.
                            </p>
                            <div className="modal__section">
                                <div className="stat-row">
                                    <span className="stat-row__label">BASE REWARD</span>
                                    <span className="stat-row__value stat-row__value--accent">2.3 $HONEY / BLOCK</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-row__label">HALVING INTERVAL</span>
                                    <span className="stat-row__value">4,200,000 BLOCKS</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-row__label">BURN RATE</span>
                                    <span className="stat-row__value">75%</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-row__label">COOLDOWN</span>
                                    <span className="stat-row__value">24 HOURS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {activeModal === 'account' && (
                <AccountModal onClose={() => setActiveModal('none')} />
            )}
            {activeModal === 'upgrade' && (
                <UpgradeHiveModal onClose={() => setActiveModal('none')} />
            )}

            <ToastContainer />
        </>
    );
}

export default function AppShell() {
    return (
        <Web3Provider>
            <GameProvider>
                <AppContent />
            </GameProvider>
        </Web3Provider>
    );
}
