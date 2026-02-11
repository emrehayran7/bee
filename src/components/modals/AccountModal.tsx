'use client';

import { useGameStore } from '@/store/gameStore';
import { useToastStore } from '@/store/toastStore';
import { useDisconnect } from 'wagmi';

interface AccountModalProps {
    onClose: () => void;
}

export default function AccountModal({ onClose }: AccountModalProps) {
    const walletAddress = useGameStore((s) => s.walletAddress);
    const ethBalance = useGameStore((s) => s.ethBalance);
    const honeyBalance = useGameStore((s) => s.honeyBalance);
    const disconnect = useGameStore((s) => s.disconnect);
    const addToast = useToastStore((s) => s.addToast);
    const { disconnect: disconnectWagmi } = useDisconnect();

    const handleCopy = () => {
        navigator.clipboard.writeText(walletAddress);
        addToast('Address copied!', 'success');
    };

    const handleDisconnect = () => {
        disconnectWagmi();
        disconnect();
        onClose();
        addToast('Wallet disconnected', 'warning');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal__title">Account</h2>

                <div className="modal__section">
                    <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
                        YOUR ACCOUNT INFORMATION AND BALANCES
                    </p>
                </div>

                <div style={{ marginBottom: 'var(--space-md)' }}>
                    <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                        WALLET ADDRESS
                    </p>
                    <div className="modal__section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '9px', color: 'var(--text-primary)' }}>
                            {walletAddress.slice(0, 12)}...{walletAddress.slice(-10)}
                        </span>
                        <button className="pixel-btn pixel-btn--sm" onClick={handleCopy}>
                            COPY
                        </button>
                    </div>
                </div>

                <div className="modal__section">
                    <div className="stat-row">
                        <span className="stat-row__label">ETH BALANCE</span>
                        <span className="stat-row__value stat-row__value--accent">
                            {ethBalance.toFixed(5)} ETH
                        </span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-row__label">HONEY BALANCE</span>
                        <span className="stat-row__value stat-row__value--accent">
                            {honeyBalance.toFixed(4)} HONEY
                        </span>
                    </div>
                </div>

                <div className="modal__actions">
                    <button className="pixel-btn" onClick={onClose}>
                        CLOSE
                    </button>
                    <button className="pixel-btn pixel-btn--danger" onClick={handleDisconnect}>
                        DISCONNECT
                    </button>
                </div>
            </div>
        </div>
    );
}
