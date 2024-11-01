import { SuiNetwork } from "@/src/entities/verifications/model/types";
import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, useState } from "react";

export interface SuiProviderWrapperProps {
  children: React.ReactNode;
  network: SuiNetwork;
}

const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

const SuiProviderWrapper: FC<SuiProviderWrapperProps> = ({
  children,
  network,
}) => {
  const [activeNetwork, setActiveNetwork] = useState(
    network as keyof typeof networkConfig
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} network={activeNetwork}>
        <WalletProvider>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default SuiProviderWrapper;
