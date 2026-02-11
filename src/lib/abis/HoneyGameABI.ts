export const HONEY_GAME_ABI = [
    // Read-only
    {
        inputs: [],
        name: 'HONEY',
        outputs: [{ internalType: 'contract IMintableBurnableERC20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'initEthFee',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
        name: 'pendingHoney',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalHoneyPower',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'blockNumber', type: 'uint256' }],
        name: 'rewardPerBlock',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'startBlock',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },


    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'players',
        outputs: [
            { internalType: 'bool', name: 'initialized', type: 'bool' },
            { internalType: 'uint32', name: 'hiveLevel', type: 'uint32' },
            { internalType: 'uint32', name: 'beeCount', type: 'uint32' },
            { internalType: 'uint128', name: 'nectarUsed', type: 'uint128' },
            { internalType: 'uint256', name: 'honeyPower', type: 'uint256' },
            { internalType: 'uint256', name: 'rewardDebt', type: 'uint256' },
            { internalType: 'uint256', name: 'pendingCarry', type: 'uint256' },
            { internalType: 'uint256', name: 'nextUpgradeTime', type: 'uint256' },
            { internalType: 'address', name: 'referrer', type: 'address' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'beeTypes',
        outputs: [
            { internalType: 'uint128', name: 'honeyRate', type: 'uint128' },
            { internalType: 'uint128', name: 'nectarConsumption', type: 'uint128' },
            { internalType: 'uint256', name: 'costHoney', type: 'uint256' },
            { internalType: 'bool', name: 'exists', type: 'bool' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'hiveLevels',
        outputs: [
            { internalType: 'uint32', name: 'totalBees', type: 'uint32' },
            { internalType: 'uint128', name: 'nectarOutput', type: 'uint128' },
            { internalType: 'uint256', name: 'costHoney', type: 'uint256' },
            { internalType: 'bool', name: 'exists', type: 'bool' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'uint256', name: '', type: 'uint256' },
        ],
        name: 'beeBalances',
        outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
        stateMutability: 'view',
        type: 'function',
    },
    // Write
    {
        inputs: [
            { internalType: 'address', name: 'referrer', type: 'address' },
            { internalType: 'bool', name: 'withFreeBee', type: 'bool' },
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'beeTypeId', type: 'uint256' },
            { internalType: 'uint32', name: 'qty', type: 'uint32' },
        ],
        name: 'buyBee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'upgradeHive',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'claim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;
