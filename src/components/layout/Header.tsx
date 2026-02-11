'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import styles from './Header.module.css';

interface HeaderProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onAccountClick: () => void;
}

export default function Header({ activeTab, onTabChange, onAccountClick }: HeaderProps) {
    const connected = useGameStore((s) => s.connected);
    const connect = useGameStore((s) => s.connect);
    const disconnect = useGameStore((s) => s.disconnect);
    const walletAddress = useGameStore((s) => s.walletAddress);

    // Sync wagmi connection state → game store
    const { address, isConnected } = useAccount();
    useEffect(() => {
        if (isConnected && address) {
            connect(address);
        }
        if (!isConnected && connected) {
            disconnect();
        }
    }, [isConnected, address, connected, connect, disconnect]);

    const navLinks = ['about', 'hive', 'bees'];

    return (
        <header className={styles.header}>
            <div className={styles.header__logo} onClick={() => onTabChange('home')}>
                <span className={styles['header__logo-icon']}>🍯</span>
                <span>HoneyBee</span>
            </div>

            <nav className={styles.header__nav}>
                {navLinks.map((link) => (
                    <button
                        key={link}
                        className={`${styles['header__nav-link']} ${activeTab === link ? styles['header__nav-link--active'] : ''
                            }`}
                        onClick={() => onTabChange(link)}
                    >
                        {link}
                    </button>
                ))}
            </nav>

            <div className={styles.header__actions}>
                {connected ? (
                    <button className="pixel-btn pixel-btn--sm" onClick={onAccountClick}>
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </button>
                ) : (
                    <ConnectButton.Custom>
                        {({ openConnectModal }) => (
                            <button className="pixel-btn" onClick={openConnectModal}>
                                Connect Wallet
                            </button>
                        )}
                    </ConnectButton.Custom>
                )}
            </div>
        </header>
    );
}
