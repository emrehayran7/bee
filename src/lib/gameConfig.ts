// ── Game Configuration ──────────────────────────────────────────────
// Mirror of smart-contract constants + static data for bee types & hive levels.
// Used by both Mock and Live modes.

export interface BeeType {
  id: number;
  name: string;
  honeyPower: number;       // honey-power per bee
  costHoney: number;        // cost in $HONEY
  nectarConsumption: number;// nectar usage
  emoji: string;            // display icon
  image: string;            // NEW: asset path
  description: string;
}

export interface HiveLevel {
  level: number;
  name: string;
  capacity: number;     // max bees
  nectarOutput: number; // max nectar budget provided by hive
  costHoney: number;    // upgrade cost in $HONEY
  description: string;
}

// ── Constants (matching smart contract) ─────────────────────────────
export const HALVING_INTERVAL = 4_200_000;
export const BASE_REWARD_PER_BLOCK = 2.3;
export const BURN_RATE = 0.75;           // 75%
export const COOLDOWN_DURATION = 24 * 60 * 60; // 24 hours in seconds
export const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD';
export const INIT_ETH_FEE = 0.001;       // default, owner can change
export const BLOCKS_PER_SECOND = 1;      // mock simulation speed

// ── Contract Addresses ──────────────────────────────────────────────
export const GAME_CONTRACT_ADDRESS = '0x4a3F1Fe025f35ECE803A341A47Db5627Cb2f2501';
export const RPC_URL = 'https://api.testnet.abs.xyz';

// ── Bee Types ───────────────────────────────────────────────────────
export const BEE_TYPES: BeeType[] = [
  {
    id: 0,
    name: 'Worker Bee',
    honeyPower: 10,
    nectarConsumption: 5,
    costHoney: 12,
    emoji: '🐝',
    image: '/assets/bees/bee-3.png', // Basic Bee
    description: 'Basic bee. Efficiency: 2.0',
  },
  {
    id: 1,
    name: 'Forager Bee',
    honeyPower: 28,
    nectarConsumption: 12,
    costHoney: 36,
    emoji: '🌻',
    image: '/assets/bees/bee-2.png', // Bee with Honey Pot at waist
    description: 'Better efficiency. Efficiency: 2.33',
  },
  {
    id: 2,
    name: 'Builder Bee',
    honeyPower: 75,
    nectarConsumption: 30,
    costHoney: 100,
    emoji: '🛠️',
    image: '/assets/bees/bee-4.png', // Bee with Hard Hat & Tools
    description: 'High capacity. Efficiency: 2.5',
  },
  {
    id: 3,
    name: 'Queen Bee',
    honeyPower: 380,
    nectarConsumption: 140,
    costHoney: 500,
    emoji: '👑',
    image: '/assets/bees/bee-0.png', // Bee with Crown
    description: 'Royalty. Efficiency: 2.71',
  },
  {
    id: 4,
    name: 'Cyber Bee',
    honeyPower: 2000,
    nectarConsumption: 700,
    costHoney: 2500,
    emoji: '🤖',
    image: '/assets/bees/bee-1.png', // Fancy/Advanced Bee
    description: 'Future tech. Efficiency: 2.85',
  },
];

// ── Hive Levels ─────────────────────────────────────────────────────
export const HIVE_LEVELS: HiveLevel[] = [
  {
    level: 0,
    name: 'Starter Hive',
    capacity: 6,
    nectarOutput: 40,
    costHoney: 0,
    description: 'Free starter home.',
  },
  {
    level: 1,
    name: 'Garden Hive',
    capacity: 10,
    nectarOutput: 80,
    costHoney: 60,
    description: 'Simple garden setup.',
  },
  {
    level: 2,
    name: 'Apiary',
    capacity: 16,
    nectarOutput: 160,
    costHoney: 140,
    description: 'Dedicated apiary.',
  },
  {
    level: 3,
    name: 'Honey Factory',
    capacity: 25,
    nectarOutput: 300,
    costHoney: 320,
    description: 'Small production facility.',
  },
  {
    level: 4,
    name: 'Industrial Hive',
    capacity: 40,
    nectarOutput: 550,
    costHoney: 750,
    description: 'Mass production.',
  },
  {
    level: 5,
    name: 'Mega Hive',
    capacity: 65,
    nectarOutput: 950,
    costHoney: 1600,
    description: 'Huge capacity.',
  },
  {
    level: 6,
    name: 'Giga Hive',
    capacity: 100,
    nectarOutput: 1600,
    costHoney: 3200,
    description: 'Massive structure.',
  },
  {
    level: 7,
    name: 'Tera Hive',
    capacity: 160,
    nectarOutput: 2600,
    costHoney: 6500,
    description: 'Dominating the field.',
  },
  {
    level: 8,
    name: 'Cosmic Hive',
    capacity: 250,
    nectarOutput: 5200,
    costHoney: 13000,
    description: 'Intergalactic honey operation.',
  },
];
