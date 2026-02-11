'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useToastStore } from '@/store/toastStore';
import { HIVE_LEVELS, BEE_TYPES, HALVING_INTERVAL, BASE_REWARD_PER_BLOCK, BLOCKS_PER_SECOND } from '@/lib/gameConfig';
import { formatEther } from 'viem';
import styles from './Dashboard.module.css';

/* eslint-disable @next/next/no-img-element */

interface DashboardProps {
    onUpgradeHive: () => void;
    onOpenShop: () => void;
}

interface BeeEntity {
    id: number;
    typeId: number;
    x: number;
    y: number;
    rotation: number;
}

export default function Dashboard({ onUpgradeHive, onOpenShop }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<'resources' | 'bees' | 'hive' | 'stats'>('resources');
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [bees, setBees] = useState<BeeEntity[]>([]);

    // Consolidated GameStore access
    const {
        honeyBalance,
        pendingHoney,
        honeyPower,
        hiveLevel,
        beeBalances,
        totalBeesOwned,
        ethBalance,
        claim,
        totalHoneyPower,
        rewardPerBlock,
        currentBlock,
        startBlock,
        buyBee,
        upgradeHive
    } = useGameStore();

    const addToast = useToastStore((s) => s.addToast);

    const hive = HIVE_LEVELS[hiveLevel];

    // Stats Calculation
    // Avoid division by zero
    const playerShare = totalHoneyPower > 0 ? (honeyPower / totalHoneyPower) * 100 : 0;

    // Halving calc
    const blocksSinceStart = Math.max(0, currentBlock - startBlock);
    const epoch = Math.floor(blocksSinceStart / HALVING_INTERVAL);
    const nextHalvingBlock = startBlock + (epoch + 1) * HALVING_INTERVAL;
    const blocksUntilHalving = Math.max(0, nextHalvingBlock - currentBlock);

    // gameConfig says BLOCKS_PER_SECOND = 1.
    const daysDisplay = blocksUntilHalving > 0
        ? (blocksUntilHalving / (24 * 60 * 60 * BLOCKS_PER_SECOND)).toFixed(1)
        : '0';

    const currentReward = rewardPerBlock || BASE_REWARD_PER_BLOCK; // Fallback to config if not fetched yet // ~6500 blocks/day on mainnet

    const handleClaim = () => {
        if (pendingHoney <= 0) {
            addToast('No honey to claim', 'warning');
            return;
        }
        claim();
        addToast('Honey claimed successfully! 🍯', 'success');
    };

    // Generate hex grid for hive visualization
    const hexCells = Array.from({ length: 25 }, (_, i) => {
        const isActive = i < totalBeesOwned;
        const isEmpty = i >= hive.capacity;
        return { isActive, isEmpty, index: i };
    });

    // ── Roaming Bees Logic ─────────────────────────────────────────────
    useEffect(() => {
        if (totalBeesOwned === 0) return;

        const interval = setInterval(() => {
            // Pick a random owned bee type
            const ownedTypes = Object.entries(beeBalances)
                .filter(([_, count]) => count > 0)
                .map(([id]) => Number(id));

            if (ownedTypes.length === 0) return;

            const randomType = ownedTypes[Math.floor(Math.random() * ownedTypes.length)];
            const targetX = 20 + Math.random() * 60; // Keep within central area
            const targetY = 20 + Math.random() * 50; // Fly upwards/outwards

            const newBee: BeeEntity = {
                id: Date.now(),
                typeId: randomType,
                x: 50, // Center
                y: 75, // Door roughly
                rotation: 0
            };

            setBees(prev => {
                const cleaned = prev.slice(-5); // Keep max 6
                return [...cleaned, newBee];
            });

            // Trigger movement after mount
            setTimeout(() => {
                setBees(prev => prev.map(b =>
                    b.id === newBee.id
                        ? { ...b, x: targetX, y: targetY, rotation: (Math.random() * 20 - 10) }
                        : b
                ));
            }, 50);

        }, 1500); // Spawn every 1.5s

        return () => clearInterval(interval);
    }, [totalBeesOwned, beeBalances]);

    return (
        <div className={styles.dashboard}>
            {/* ── Left Panel ─────────────────────────────────────────── */}
            <div className={styles.dashboard__left}>
                {/* Tabs */}
                <div className="pixel-card">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'resources' ? 'tab--active' : ''}`}
                            onClick={() => setActiveTab('resources')}
                        >
                            Resources
                        </button>
                        <button
                            className={`tab ${activeTab === 'stats' ? 'tab--active' : ''}`}
                            onClick={() => setActiveTab('stats')}
                        >
                            Stats
                        </button>
                        <button
                            className={`tab ${activeTab === 'bees' ? 'tab--active' : ''}`}
                            onClick={() => setActiveTab('bees')}
                        >
                            Bees
                        </button>
                    </div>

                    {/* Resources Tab */}
                    {activeTab === 'resources' && (
                        <div className={styles.resources}>
                            <div className="stat-row">
                                <span className="stat-row__icon">⟠</span>
                                <span className="stat-row__label">{ethBalance.toFixed(5)} ETH</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-row__icon">🍯</span>
                                <span className="stat-row__label">{honeyBalance.toFixed(4)} HONEY</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-row__icon">🐝</span>
                                <span className="stat-row__label">{totalBeesOwned} / {hive.capacity} BEES</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-row__icon">⚡</span>
                                <span className="stat-row__label">{honeyPower.toLocaleString()} HONEY POWER</span>
                            </div>
                        </div>
                    )}

                    {/* Stats Tab */}
                    {activeTab === 'stats' && (
                        <div className={styles['stats-section']}>
                            <div className="stat-row">
                                <span className="stat-row__label">PRODUCING</span>
                                <span className="stat-row__value stat-row__value--accent">
                                    {(currentReward * playerShare / 100).toFixed(4)} / BLOCK
                                </span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-row__label">HOURLY EARNING</span>
                                <span className="stat-row__value stat-row__value--accent">
                                    {((currentReward * playerShare / 100) * 3600).toFixed(4)} $HONEY
                                </span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-row__label">HONEY POWER</span>
                                <span className="stat-row__value">
                                    {honeyPower.toLocaleString()} HP
                                </span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-row__label">NEXT HALVING</span>
                                <span className="stat-row__value stat-row__value--accent">
                                    ~{daysDisplay} DAYS
                                </span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-row__label">NETWORK SHARE</span>
                                <span className="stat-row__value">
                                    {playerShare.toFixed(6)}%
                                </span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-row__label">TOTAL NETWORK HP</span>
                                <span className="stat-row__value">
                                    {totalHoneyPower.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Bees Tab */}
                    {activeTab === 'bees' && (
                        <div className={styles.resources}>
                            {BEE_TYPES.map((bee) => {
                                const qty = beeBalances[bee.id] || 0;
                                if (qty === 0) return null;
                                return (
                                    <div className="stat-row" key={bee.id}>
                                        <div className="w-6 h-6 relative flex items-center justify-center mr-2">
                                            <img
                                                src={bee.image}
                                                alt={bee.name}
                                                className="w-full h-full object-contain pixelated"
                                                style={{ imageRendering: 'pixelated' }}
                                            />
                                        </div>
                                        <span className="stat-row__label">{bee.name}</span>
                                        <span className="stat-row__value stat-row__value--accent">
                                            ×{qty}
                                        </span>
                                    </div>
                                );
                            })}
                            {totalBeesOwned === 0 && (
                                <p style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-md)' }}>
                                    No bees yet. Visit the shop! 🐝
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Claim Box */}
                <div className={styles['claim-box']}>
                    <p className={styles['claim-box__label']}>PENDING HONEY</p>
                    <p className={styles['claim-box__amount']}>
                        {pendingHoney.toFixed(5)} $HONEY
                    </p>
                    <button
                        className="pixel-btn pixel-btn--primary w-full"
                        onClick={handleClaim}
                        disabled={pendingHoney <= 0}
                    >
                        CLAIM HONEY 🍯
                    </button>
                </div>
            </div>

            {/* ── Right Panel (Hive Scene) ──────────────────────────── */}
            <div className={styles.dashboard__right}>
                <div className={styles['hive-scene']}>
                    <div className={styles['hive-scene__bg']} />
                    <div className={styles['hive-scene__content']}>
                        <img
                            src="/assets/hive.png"
                            alt="Hive"
                            className={styles['hive-scene__hive-img']}
                            style={{
                                position: 'absolute',
                                width: '300px',
                                height: 'auto',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                imageRendering: 'pixelated',
                                zIndex: 0
                            }}
                        />

                    </div>

                    {/* Roaming Bees Layer */}
                    {bees.map(bee => {
                        const beeConfig = BEE_TYPES[bee.typeId];
                        return (
                            <img
                                key={bee.id}
                                src={beeConfig.image}
                                alt="roaming bee"
                                style={{
                                    position: 'absolute',
                                    left: `${bee.x}%`,
                                    top: `${bee.y}%`,
                                    width: '8%', // Size relative to container
                                    height: 'auto',
                                    transform: `translate(-50%, -50%) rotate(${bee.rotation}deg)`,
                                    transition: 'all 3s ease-out',
                                    zIndex: 2,
                                    imageRendering: 'pixelated',
                                    pointerEvents: 'none',
                                    opacity: bee.y === 75 ? 0 : 1, // Fate in from door
                                }}
                            />
                        );
                    })}
                    <div className={styles['hive-scene__buttons']}>
                        <button className="pixel-btn pixel-btn--sm" onClick={onOpenShop}>
                            BEES
                        </button>
                        <button className="pixel-btn pixel-btn--sm" onClick={onUpgradeHive}>
                            UPGRADE
                        </button>
                    </div>
                    <div className={styles['hive-scene__level-badge']}>
                        {hive.name.toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    );
}
