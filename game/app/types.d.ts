export interface PhantomWindow {
  solana?: {
    isPhantom?: boolean;
    connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
    disconnect: () => Promise<void>;
    publicKey?: { toString: () => string };
    isConnected?: boolean;
  };
}

declare global {
  interface Window extends PhantomWindow {}
}
