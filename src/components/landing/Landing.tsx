'use client';

import { useGameStore } from '@/store/gameStore';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from './Landing.module.css';

export default function Landing() {
    const totalHoneyMined = useGameStore((s) => s.totalHoneyMined);

    // For the hero scene
    const floatingBees = [
        { id: 1, type: 0, top: '20%', left: '15%', delay: '0s', duration: '4s' },
        { id: 2, type: 0, top: '15%', left: '80%', delay: '1s', duration: '5s' },
        { id: 3, type: 0, top: '70%', left: '20%', delay: '2s', duration: '4.5s' },
        { id: 4, type: 0, top: '65%', left: '75%', delay: '0.5s', duration: '3.5s' },
    ];

    return (
        <div className={styles.landing}>
            <h1 className={styles.landing__title}>
                <span className={styles['landing__title-white']}>HoneyBee:</span>{' '}
                A Decentralized Honey Production System
            </h1>

            <p className={styles.landing__counter}>
                <span className={styles['landing__counter-value']}>
                    {totalHoneyMined.toLocaleString()}
                </span>{' '}
                $HONEY has been produced.
            </p>

            <p className={styles.landing__sub}>
                START PRODUCING TODAY.
            </p>

            <div className={styles.landing__art}>
                <div className={styles['landing__hero-scene']}>
                    {/* Floating Bees */}
                    {floatingBees.map((bee) => (
                        <img
                            key={bee.id}
                            src={`/assets/bees/bee-${bee.type}.png`}
                            alt="bee"
                            className={styles.landing__floating_bee}
                            style={{
                                top: bee.top,
                                left: bee.left,
                                animationDelay: bee.delay,
                                animationDuration: bee.duration
                            }}
                        />
                    ))}

                    <img
                        src="/assets/hive.png"
                        alt="Hero Hive"
                        className={styles.landing__hero_hive}
                    />

                    {/* Decorative Honey Glow */}
                    <div className={styles.landing__glow} />
                </div>
            </div>

            <div className={styles.landing__cta}>
                <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                        <button
                            className="pixel-btn pixel-btn--primary"
                            onClick={openConnectModal}
                        >
                            CONNECT WALLET TO START PRODUCING
                        </button>
                    )}
                </ConnectButton.Custom>
            </div>
        </div>
    );
}
