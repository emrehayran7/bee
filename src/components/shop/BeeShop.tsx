'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useToastStore } from '@/store/toastStore';
import { BEE_TYPES, HIVE_LEVELS } from '@/lib/gameConfig';
import styles from './BeeShop.module.css';

/* eslint-disable @next/next/no-img-element */

export default function BeeShop() {
    const honeyBalance = useGameStore((s) => s.honeyBalance);
    const beeBalances = useGameStore((s) => s.beeBalances);
    const hiveLevel = useGameStore((s) => s.hiveLevel);
    const totalBeesOwned = useGameStore((s) => s.totalBeesOwned);
    const nectarUsed = useGameStore((s) => s.nectarUsed);
    const buyBee = useGameStore((s) => s.buyBee);
    const addToast = useToastStore((s) => s.addToast);

    const hive = HIVE_LEVELS[hiveLevel];
    const slotsLeft = hive.capacity - totalBeesOwned;
    const nectarLeft = hive.nectarOutput - nectarUsed;

    return (
        <div className={styles.shop}>
            <h2 className={styles.shop__title}>🐝 Bee Shop</h2>
            <p className={styles.shop__subtitle}>
                ACQUIRE BEES TO BOOST YOUR HONEY PRODUCTION
            </p>
            <div className="flex gap-4 mb-4 text-[10px] text-gray-400 justify-center">
                <span>HIVE SLOTS: {slotsLeft} LEFT</span>
                <span>NECTAR: {nectarLeft} LEFT</span>
            </div>

            <div className={styles.shop__grid}>
                {BEE_TYPES.map((bee) => (
                    <BeeCard
                        key={bee.id}
                        bee={bee}
                        owned={beeBalances[bee.id] || 0}
                        honeyBalance={honeyBalance}
                        slotsLeft={slotsLeft}
                        nectarLeft={nectarLeft}
                        onBuy={(qty) => {
                            buyBee(bee.id, qty);
                            addToast(`Bought ${qty}× ${bee.name}! ${bee.emoji}`, 'success');
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function BeeCard({
    bee,
    owned,
    honeyBalance,
    slotsLeft,
    nectarLeft,
    onBuy,
}: {
    bee: (typeof BEE_TYPES)[number];
    owned: number;
    honeyBalance: number;
    slotsLeft: number;
    nectarLeft: number;
    onBuy: (qty: number) => void;
}) {
    const [qty, setQty] = useState(1);
    const cost = bee.costHoney * qty;
    const nectarCost = bee.nectarConsumption * qty;

    const canAfford = honeyBalance >= cost;
    const hasSlots = qty <= slotsLeft;
    const hasNectar = nectarCost <= nectarLeft;

    const canBuy = canAfford && hasSlots && hasNectar && (bee.costHoney > 0 || owned === 0);

    return (
        <div className={styles['bee-card']}>
            <div className={styles['bee-card__header']}>
                <div className="w-12 h-12 relative flex items-center justify-center">
                    <img
                        src={bee.image}
                        alt={bee.name}
                        className="w-full h-full object-contain pixelated"
                        style={{ imageRendering: 'pixelated' }}
                    />
                </div>
                <span className={styles['bee-card__name']}>{bee.name}</span>
            </div>

            <p className={styles['bee-card__desc']}>{bee.description}</p>

            <div className={styles['bee-card__stats']}>
                <div className={styles['bee-card__stat']}>
                    <span className={styles['bee-card__stat-label']}>HONEY PWR</span>
                    <span className={styles['bee-card__stat-value']}>{bee.honeyPower}</span>
                </div>
                <div className={styles['bee-card__stat']}>
                    <span className={styles['bee-card__stat-label']}>NECTAR</span>
                    <span className={styles['bee-card__stat-value']}>{bee.nectarConsumption}</span>
                </div>
                <div className={styles['bee-card__stat']}>
                    <span className={styles['bee-card__stat-label']}>COST</span>
                    <span className={styles['bee-card__stat-value']}>
                        {bee.costHoney === 0 ? 'FREE' : bee.costHoney}
                    </span>
                </div>
            </div>

            <p className={styles['bee-card__owned']}>OWNED: {owned}</p>

            {bee.costHoney > 0 && (
                <>
                    <div className={styles['bee-card__qty']}>
                        <button
                            className={styles['bee-card__qty-btn']}
                            onClick={() => setQty(Math.max(1, qty - 1))}
                        >
                            −
                        </button>
                        <span className={styles['bee-card__qty-value']}>{qty}</span>
                        <button
                            className={styles['bee-card__qty-btn']}
                            onClick={() => setQty(qty + 1)}
                        >
                            +
                        </button>
                    </div>

                    <p className={`${styles['bee-card__cost']} ${!canAfford ? styles['bee-card__cost--error'] : ''}`}>
                        TOTAL: {cost} $HONEY
                    </p>
                    {!hasSlots && <p className="text-red-500 text-[9px] text-center">HIVE FULL</p>}
                    {!hasNectar && <p className="text-red-500 text-[9px] text-center">NO NECTAR</p>}
                </>
            )}

            <button
                className="pixel-btn pixel-btn--primary w-full"
                onClick={() => onBuy(qty)}
                disabled={!canBuy}
            >
                {bee.costHoney === 0 ? 'CLAIM FREE' : 'BUY'}
            </button>
        </div>
    );
}
