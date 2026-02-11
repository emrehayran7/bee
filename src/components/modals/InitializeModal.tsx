'use client';

import { useGameStore } from '@/store/gameStore';
import { useToastStore } from '@/store/toastStore';
import { INIT_ETH_FEE } from '@/lib/gameConfig';
import { useState } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';

interface InitializeModalProps {
    onClose: () => void;
}

export default function InitializeModal({ onClose }: InitializeModalProps) {
    // Store Actions
    const initialize = useGameStore((s) => s.initialize);
    const disconnectGame = useGameStore((s) => s.disconnect);
    const addToast = useToastStore((s) => s.addToast);

    // Wagmi Hooks
    const { address } = useAccount();
    const { disconnect: disconnectWagmi } = useDisconnect();
    const ethBalance = useGameStore((s) => s.ethBalance);

    // Logic
    const canAfford = ethBalance >= INIT_ETH_FEE;

    const handleCancel = () => {
        // Fully disconnect to escape the initialize screen
        disconnectWagmi();
        disconnectGame();
        onClose();
        addToast('Disconnected', 'info');
    };

    const handleInitialize = () => {
        // Hardcode withFreeBee to true as the UI option was removed
        initialize(true);
        addToast('Initialized with a free Worker Bee! 🐝', 'success');
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal__title">🍯 Start Producing</h2>

                <div className="modal__section">
                    <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                        INITIALIZE YOUR HIVE TO BEGIN PRODUCING $HONEY
                    </p>
                </div>

                <div className="modal__section">
                    <div className="stat-row">
                        <span className="stat-row__label">INITIALIZATION FEE</span>
                        <span className="stat-row__value stat-row__value--accent">
                            {INIT_ETH_FEE} ETH
                        </span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-row__label">YOUR ETH BALANCE</span>
                        <span className={`stat-row__value ${canAfford ? 'stat-row__value--success' : 'text-error'}`}>
                            {ethBalance.toFixed(5)} ETH
                        </span>
                    </div>
                </div>

                <div className="modal__actions">
                    <button className="pixel-btn" onClick={handleCancel}>
                        CANCEL / DISCONNECT
                    </button>
                    <button
                        className="pixel-btn pixel-btn--primary"
                        onClick={handleInitialize}
                    >
                        INITIALIZE
                    </button>
                </div>
            </div>
        </div>
    );
}
