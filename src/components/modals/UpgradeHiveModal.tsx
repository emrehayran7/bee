'use client';

import { useGameStore } from '@/store/gameStore';
import { useToastStore } from '@/store/toastStore';
import { HIVE_LEVELS } from '@/lib/gameConfig';

interface UpgradeHiveModalProps {
    onClose: () => void;
}

export default function UpgradeHiveModal({ onClose }: UpgradeHiveModalProps) {
    const hiveLevel = useGameStore((s) => s.hiveLevel);
    const honeyBalance = useGameStore((s) => s.honeyBalance);
    const nextUpgradeTime = useGameStore((s) => s.nextUpgradeTime);
    const upgradeHive = useGameStore((s) => s.upgradeHive);
    const addToast = useToastStore((s) => s.addToast);

    const currentHive = HIVE_LEVELS[hiveLevel];
    const nextHive = HIVE_LEVELS[hiveLevel + 1];
    const isMaxLevel = !nextHive;

    const now = Date.now() / 1000;
    const onCooldown = nextUpgradeTime > now;
    const cooldownRemaining = onCooldown ? Math.ceil(nextUpgradeTime - now) : 0;
    const canAfford = nextHive ? honeyBalance >= nextHive.costHoney : false;

    const formatCooldown = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleUpgrade = () => {
        upgradeHive();
        addToast(`Hive upgraded to ${nextHive!.name}!`, 'success');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal__title">Upgrade Hive</h2>

                <div className="modal__section">
                    <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                        UPGRADE YOUR HIVE TO INCREASE CAPACITY AND HONEY OUTPUT
                    </p>
                </div>

                {isMaxLevel ? (
                    <div className="modal__section" style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '10px', color: 'var(--text-accent)' }}>
                            🏆 MAX LEVEL REACHED
                        </p>
                        <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
                            Your {currentHive.name} is at its peak!
                        </p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'stretch' }}>
                            {/* Current Hive */}
                            <div className="modal__section" style={{ flex: 1, textAlign: 'center' }}>
                                <p style={{ fontSize: '9px', color: 'var(--text-accent)', marginBottom: 'var(--space-sm)' }}>
                                    CURRENT HIVE
                                </p>
                                <p style={{ fontSize: '24px', marginBottom: 'var(--space-sm)' }}>🏠</p>
                                <p style={{ fontSize: '9px', color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>
                                    {currentHive.name}
                                </p>
                                <p style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>
                                    MAX BEES: {currentHive.capacity}
                                </p>
                                <p style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>
                                    OUTPUT: ×{currentHive.nectarOutput}
                                </p>
                            </div>

                            {/* Arrow */}
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', color: 'var(--text-accent)' }}>
                                →
                            </div>

                            {/* Next Hive */}
                            <div className="modal__section" style={{ flex: 1, textAlign: 'center' }}>
                                <p style={{ fontSize: '9px', color: 'var(--text-accent)', marginBottom: 'var(--space-sm)' }}>
                                    NEXT HIVE
                                </p>
                                <p style={{ fontSize: '24px', marginBottom: 'var(--space-sm)' }}>🏡</p>
                                <p style={{ fontSize: '9px', color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>
                                    {nextHive.name}
                                </p>
                                <p style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>
                                    MAX BEES: {nextHive.capacity}
                                </p>
                                <p style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>
                                    OUTPUT: ×{nextHive.nectarOutput}
                                </p>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
                            <p style={{ fontSize: '10px', color: 'var(--text-accent)' }}>
                                UPGRADE COST: {nextHive.costHoney} $HONEY
                            </p>
                            {!canAfford && (
                                <p style={{ fontSize: '8px', color: 'var(--error)', marginTop: 'var(--space-xs)' }}>
                                    INSUFFICIENT $HONEY BALANCE
                                </p>
                            )}
                            {onCooldown && (
                                <p style={{ fontSize: '8px', color: 'var(--warning)', marginTop: 'var(--space-xs)' }}>
                                    COOLDOWN: {formatCooldown(cooldownRemaining)}
                                </p>
                            )}
                        </div>
                    </>
                )}

                <div className="modal__actions">
                    <button className="pixel-btn" onClick={onClose}>
                        CANCEL
                    </button>
                    {!isMaxLevel && (
                        <button
                            className="pixel-btn pixel-btn--primary"
                            onClick={handleUpgrade}
                            disabled={!canAfford || onCooldown}
                        >
                            UPGRADE
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
