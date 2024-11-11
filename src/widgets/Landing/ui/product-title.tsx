"use client";
import { useEffect, useRef, useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "viem/chains";

const chains = ["Sui"];
// TODO: add ["SUI", "Aptos", "Neutron"];

export const config = createConfig({
  chains: [arbitrum, arbitrumSepolia],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

export default function ProductTitle() {
  const [chain, setChain] = useState(chains[0]);
  const [animation, setAnimation] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimation(true);
      setTimeout(() => {
        setChain((prevProtocol) => {
          const index = chains.indexOf(prevProtocol);
          return chains[(index + 1) % chains.length];
        });
        setAnimation(false);
      }, 500);
    }, 1500);

    return () => clearInterval(intervalId);
  }, [chain]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <h1 className="w-[660px] flex gap-4 text-4xl font-bold">
      Verificator for <div className={`text-blue-500`}>{chain}</div>
    </h1>
  );
}
