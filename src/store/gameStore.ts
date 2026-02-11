'use client';

import { create } from 'zustand';
import {
    BEE_TYPES,
    HIVE_LEVELS,
    BASE_REWARD_PER_BLOCK,
    HALVING_INTERVAL,
    BURN_RATE,
    COOLDOWN_DURATION,
    INIT_ETH_FEE,
    GAME_CONTRACT_ADDRESS,
} from '@/lib/gameConfig';
import { writeContract, waitForTransactionReceipt, readContract } from '@wagmi/core';
import { wagmiConfig, HONEY_GAME_ABI, HONEY_TOKEN_ABI } from '@/lib/web3Config';
import { parseEther } from 'viem';

// ── Types ───────────────────────────────────────────────────────────
export interface PlayerState {
    initialized: boolean;
    honeyBalance: number;
    pendingHoney: number;
    honeyPower: number;
    hiveLevel: number;
    beeBalances: Record<number, number>;  // beeTypeId -> quantity
    nectarUsed: number;
    nextUpgradeTime: number;              // unix timestamp
    lastClaimTime: number;                // unix timestamp (ms)
    totalBeesOwned: number;
    ethBalance: number;
}

export interface GameState extends PlayerState {
    // Global
    connected: boolean;
    walletAddress: string;
    tokenContractAddress: string;
    totalHoneyPower: number;
    totalHoneyMined: number;
    currentBlock: number;
    rewardPerBlock: number;
    startBlock: number;
    refreshTrigger: () => void;

    // Actions
    connect: (address?: string) => void;
    setTokenAddress: (address: string) => void;
    disconnect: () => void;
    initialize: (withFreeBee: boolean) => Promise<void>;
    buyBee: (beeTypeId: number, qty: number) => Promise<void>;
    upgradeHive: () => Promise<void>;
    claim: () => Promise<void>;
    tick: () => void;
    setRefetch: (fn: () => void) => void;
    refetchData: () => void;
}

// ── Store ───────────────────────────────────────────────────────────
export const useGameStore = create<GameState>((set, get) => ({
    // Player
    initialized: false,
    honeyBalance: 0,
    pendingHoney: 0,
    honeyPower: 0,
    hiveLevel: 0,
    beeBalances: {},
    nectarUsed: 0,
    currentBlock: 0,
    nextUpgradeTime: 0,
    lastClaimTime: 0,
    totalBeesOwned: 0,
    ethBalance: 0,

    // Global
    connected: false,
    walletAddress: '',
    tokenContractAddress: '',
    totalHoneyPower: 0,
    totalHoneyMined: 0,
    rewardPerBlock: 0,
    refreshTrigger: () => { },
    startBlock: 0,

    // ── Actions ──────────────────────────────────────────────────────
    connect: (address) =>
        set({
            connected: true,
            walletAddress: address || '',
        }),

    setTokenAddress: (address) => set({ tokenContractAddress: address }),

    disconnect: () =>
        set({
            connected: false,
            walletAddress: '',
            initialized: false,
            honeyBalance: 0,
            pendingHoney: 0,
            honeyPower: 0,
            hiveLevel: 0,
            beeBalances: {},
            nectarUsed: 0,
            nextUpgradeTime: 0,
            lastClaimTime: 0,
            totalBeesOwned: 0,
        }),

    initialize: async (withFreeBee) => {
        try {
            console.log('Initializing via Contract...');
            const hash = await writeContract(wagmiConfig, {
                address: GAME_CONTRACT_ADDRESS as `0x${string}`,
                abi: HONEY_GAME_ABI,
                functionName: 'initialize',
                args: [
                    '0x0000000000000000000000000000000000000000', // referrer (address(0))
                    withFreeBee
                ],
                value: parseEther(INIT_ETH_FEE.toString()),
            });

            console.log('Transaction sent:', hash);
            await waitForTransactionReceipt(wagmiConfig, { hash });
            console.log('Transaction confirmed!');

            // Update state via fetch
            set({ initialized: true }); // minimal optimistic update
            get().refetchData();

        } catch (error) {
            console.error('Initialize failed:', error);
        }
    },

    buyBee: async (beeTypeId, qty) => {
        const { tokenContractAddress, walletAddress } = get();
        if (!tokenContractAddress || !walletAddress) return;

        try {
            console.log(`Buying bee ${beeTypeId} x${qty}`);
            const bee = BEE_TYPES[beeTypeId];
            const cost = BigInt(bee.costHoney) * BigInt(qty) * BigInt(1e18);

            if (cost > BigInt(0)) {
                // Check allowance
                const allowance = await readContract(wagmiConfig, {
                    address: tokenContractAddress as `0x${string}`,
                    abi: HONEY_TOKEN_ABI,
                    functionName: 'allowance',
                    args: [walletAddress as `0x${string}`, GAME_CONTRACT_ADDRESS as `0x${string}`],
                });

                if (allowance < cost) {
                    console.log('Approving HONEY...');
                    const approveHash = await writeContract(wagmiConfig, {
                        address: tokenContractAddress as `0x${string}`,
                        abi: HONEY_TOKEN_ABI,
                        functionName: 'approve',
                        args: [GAME_CONTRACT_ADDRESS as `0x${string}`, cost],
                    });
                    await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });
                    console.log('Approved!');
                }
            }

            // Buy
            const hash = await writeContract(wagmiConfig, {
                address: GAME_CONTRACT_ADDRESS as `0x${string}`,
                abi: HONEY_GAME_ABI,
                functionName: 'buyBee',
                args: [BigInt(beeTypeId), qty],
            });
            console.log('Buy transaction:', hash);
            await waitForTransactionReceipt(wagmiConfig, { hash });
            console.log('Buy confirmed!');

            // Wait 1s for indexing
            setTimeout(() => get().refetchData(), 1000);
        } catch (error) {
            console.error('Buy Bee failed:', error);
        }
    },

    upgradeHive: async () => {
        const { tokenContractAddress, walletAddress, hiveLevel } = get();
        if (!tokenContractAddress || !walletAddress) return;

        try {
            console.log('Upgrading Hive...');
            const nextLevel = HIVE_LEVELS[hiveLevel + 1];
            if (!nextLevel) return;

            const cost = BigInt(nextLevel.costHoney) * BigInt(1e18);

            if (cost > BigInt(0)) {
                const allowance = await readContract(wagmiConfig, {
                    address: tokenContractAddress as `0x${string}`,
                    abi: HONEY_TOKEN_ABI,
                    functionName: 'allowance',
                    args: [walletAddress as `0x${string}`, GAME_CONTRACT_ADDRESS as `0x${string}`],
                });

                if (allowance < cost) {
                    const approveHash = await writeContract(wagmiConfig, {
                        address: tokenContractAddress as `0x${string}`,
                        abi: HONEY_TOKEN_ABI,
                        functionName: 'approve',
                        args: [GAME_CONTRACT_ADDRESS as `0x${string}`, cost],
                    });
                    await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });
                    console.log('Approved!');
                }
            }

            const hash = await writeContract(wagmiConfig, {
                address: GAME_CONTRACT_ADDRESS as `0x${string}`,
                abi: HONEY_GAME_ABI,
                functionName: 'upgradeHive',
                args: [],
            });

            console.log('Upgrade tx sent:', hash);
            await waitForTransactionReceipt(wagmiConfig, { hash });
            console.log('Upgrade confirmed!');

            // Wait 1s for indexing
            setTimeout(() => get().refetchData(), 1000);
        } catch (error) {
            console.error('Upgrade failed:', error);
        }
    },

    claim: async () => {
        const { connected, walletAddress } = get();
        if (!connected || !walletAddress) return;

        try {
            console.log('Claiming Honey...');
            const hash = await writeContract(wagmiConfig, {
                address: GAME_CONTRACT_ADDRESS as `0x${string}`,
                abi: HONEY_GAME_ABI,
                functionName: 'claim',
                args: [],
            });

            console.log('Claim tx sent:', hash);
            await waitForTransactionReceipt(wagmiConfig, { hash });
            console.log('Claim confirmed!');

            // Wait 1s for indexing
            setTimeout(() => get().refetchData(), 1000);
        } catch (error) {
            console.error('Claim failed:', error);
        }
    },

    tick: () => {
        // No-op for now, relying on block updates
    },

    // Refetching
    setRefetch: (fn) => set({ refreshTrigger: fn }),
    refetchData: () => {
        const { refreshTrigger } = get();
        console.log('Refetch data requested...');
        if (refreshTrigger) refreshTrigger();
    },
}));
