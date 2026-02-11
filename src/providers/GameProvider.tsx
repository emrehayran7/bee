'use client';

import { ReactNode, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useReadContract, useAccount, useReadContracts, useBlockNumber, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { GAME_CONTRACT_ADDRESS, BEE_TYPES } from '@/lib/gameConfig';
import { HONEY_GAME_ABI, HONEY_TOKEN_ABI } from '@/lib/web3Config';

export default function GameProvider({ children }: { children: ReactNode }) {
    const setTokenAddress = useGameStore((s) => s.setTokenAddress);
    const { address } = useAccount();
    const { data: blockNumber } = useBlockNumber({ watch: true });
    const { data: ethBalanceData, refetch: refetchEth } = useBalance({ address });

    // 0. Manual Refetch Trigger & Player Data
    const { data: playerData, refetch: refetchPlayer } = useReadContract({
        address: GAME_CONTRACT_ADDRESS as `0x${string}`,
        abi: HONEY_GAME_ABI,
        functionName: 'players',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 3000,
        }
    });

    // 1. Read HONEY token address
    const { data: honeyAddress } = useReadContract({
        address: GAME_CONTRACT_ADDRESS as `0x${string}`,
        abi: HONEY_GAME_ABI,
        functionName: 'HONEY',
    });

    // 3. Fetch Global Reward Per Block (Critical for Producing/Hourly stats)
    const { data: rewardPerBlockData, refetch: refetchReward } = useReadContract({
        address: GAME_CONTRACT_ADDRESS as `0x${string}`,
        abi: HONEY_GAME_ABI,
        functionName: 'rewardPerBlock',
        args: [blockNumber ? BigInt(blockNumber) : BigInt(0)],
        query: { refetchInterval: 3000 }
    });

    // 4. Fetch Global Network Power
    const { data: totalPowerData, refetch: refetchTotalPower } = useReadContract({
        address: GAME_CONTRACT_ADDRESS as `0x${string}`,
        abi: HONEY_GAME_ABI,
        functionName: 'totalHoneyPower',
        query: { refetchInterval: 3000 }
    });

    // 5. Fetch Pending Rewards
    const { data: pendingHoneyData, refetch: refetchPending } = useReadContract({
        address: GAME_CONTRACT_ADDRESS as `0x${string}`,
        abi: HONEY_GAME_ABI,
        functionName: 'pendingHoney',
        args: address ? [address] : undefined,
        query: { enabled: !!address, refetchInterval: 3000 }
    });

    // 6. Fetch Wallet Balance
    const { data: honeyBalanceData, refetch: refetchBalance } = useReadContract({
        address: honeyAddress as `0x${string}`,
        abi: HONEY_TOKEN_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address && !!honeyAddress, refetchInterval: 3000 }
    });

    // 7. Fetch Total Supply (Global Production)
    const { data: totalSupplyData, refetch: refetchTotalSupply } = useReadContract({
        address: honeyAddress as `0x${string}`,
        abi: HONEY_TOKEN_ABI,
        functionName: 'totalSupply',
        query: { enabled: !!honeyAddress, refetchInterval: 10000 } // Less frequent
    });

    // 8. Fetch Bee Balances
    const { data: beeBalancesData, refetch: refetchBees } = useReadContracts({
        contracts: BEE_TYPES.map(bee => ({
            address: GAME_CONTRACT_ADDRESS as `0x${string}`,
            abi: HONEY_GAME_ABI,
            functionName: 'beeBalances',
            args: [address, BigInt(bee.id)],
        })),
        query: { enabled: !!address, refetchInterval: 3000 }
    });

    // 8. Fetch Start Block
    const { data: startBlockData } = useReadContract({
        address: GAME_CONTRACT_ADDRESS as `0x${string}`,
        abi: HONEY_GAME_ABI,
        functionName: 'startBlock',
    });

    useEffect(() => {
        useGameStore.getState().setRefetch(async () => {
            console.log('Manual refetch triggered for ALL data');
            // Parallel refetch
            await Promise.all([
                refetchPlayer(),
                refetchReward(),
                refetchTotalPower(),
                refetchPending(),
                refetchBalance(),
                refetchTotalSupply(),
                refetchEth(),
                refetchBees()
            ]);
        });
    }, [refetchPlayer, refetchReward, refetchTotalPower, refetchPending, refetchBalance, refetchTotalSupply, refetchEth, refetchBees]);

    useEffect(() => {
        if (honeyAddress) {
            setTokenAddress(honeyAddress);
        }
    }, [honeyAddress, setTokenAddress]);

    useEffect(() => {
        if (blockNumber) {
            useGameStore.setState({ currentBlock: Number(blockNumber) });
        }
    }, [blockNumber]);

    useEffect(() => {
        if (startBlockData) {
            useGameStore.setState({ startBlock: Number(startBlockData) });
        }
    }, [startBlockData]);

    // Sync Store Effect
    useEffect(() => {
        const updates: any = {};

        // Sync Player Stats
        if (playerData) {
            console.log("Raw Player Data:", playerData); // DEBUG LOG
            const [
                _initialized, _hiveLevel, _beeCount, _nectarUsed,
                _honeyPower, _rewardDebt, _pendingCarry, _nextUpgradeTime
            ] = playerData;

            // Check if honeyPower is mistakenly at a different index?
            // With log we can see.

            updates.initialized = _initialized;
            updates.hiveLevel = _hiveLevel;
            updates.totalBeesOwned = Number(_beeCount);
            updates.nectarUsed = Number(_nectarUsed);
            updates.honeyPower = Number(_honeyPower); // Raw Power value
            updates.nextUpgradeTime = Number(_nextUpgradeTime);
        }

        // Sync Global Stats
        if (totalSupplyData !== undefined) {
            updates.totalHoneyMined = parseFloat(formatEther(totalSupplyData));
        }

        if (totalPowerData !== undefined) {
            updates.totalHoneyPower = Number(totalPowerData);
        }

        if (rewardPerBlockData !== undefined) {
            // rewardPerBlock is usually 18 decimals in generic contracts, but here 2.3?
            // If it is 2300000000000000000 (2.3 ether), formatEther makes it "2.3".
            updates.rewardPerBlock = parseFloat(formatEther(rewardPerBlockData));
        }

        // Sync Balances
        if (pendingHoneyData !== undefined) {
            updates.pendingHoney = parseFloat(formatEther(pendingHoneyData));
        }

        if (honeyBalanceData !== undefined) {
            updates.honeyBalance = parseFloat(formatEther(honeyBalanceData));
        }

        if (ethBalanceData !== undefined) {
            updates.ethBalance = parseFloat(formatEther(ethBalanceData.value));
        }

        // Sync Bee Balances
        if (beeBalancesData) {
            const balances: Record<number, number> = {};
            beeBalancesData.forEach((result, index) => {
                if (result.status === 'success') {
                    balances[BEE_TYPES[index].id] = Number(result.result);
                }
            });
            updates.beeBalances = balances;
        }

        if (Object.keys(updates).length > 0) {
            useGameStore.setState(updates);
        }
    }, [playerData, totalPowerData, rewardPerBlockData, pendingHoneyData, honeyBalanceData, beeBalancesData, ethBalanceData, totalSupplyData]);

    return <>{children}</>;
}
