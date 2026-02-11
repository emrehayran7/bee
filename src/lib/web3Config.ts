import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { abstractTestnet } from 'wagmi/chains';
import { abstractWallet } from '@abstract-foundation/agw-react/connectors';

// ── RainbowKit + Abstract Global Wallet Configuration ────────────────
export const PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'PLACEHOLDER_PROJECT_ID';

export const wagmiConfig = getDefaultConfig({
    appName: 'HoneyBee',
    projectId: PROJECT_ID,
    chains: [abstractTestnet],
    wallets: [
        {
            groupName: 'Recommended',
            wallets: [abstractWallet],
        },
    ],
    ssr: true,
});

// ── Contract Addresses (replace before mainnet deploy) ──────────────
// ── Contract Addresses (replace before mainnet deploy) ──────────────
export const CONTRACTS = {
    honeyToken: '0x0000000000000000000000000000000000000000',
    honeyGame: '0x4a3F1Fe025f35ECE803A341A47Db5627Cb2f2501',
} as const;

// ── Minimal ABIs ────────────────────────────────────────────────────
export { HONEY_TOKEN_ABI } from '@/lib/abis/HoneyTokenABI';
export { HONEY_GAME_ABI } from '@/lib/abis/HoneyGameABI';
