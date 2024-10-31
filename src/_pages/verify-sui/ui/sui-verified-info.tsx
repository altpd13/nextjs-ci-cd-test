"use client";

import { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/ui";
import { CodeExplorer } from "../../verify/ui/code-explorer";
import { SuiContractInteract } from "./sui-contract-interact";
import SuiProviderWrapper from "./sui-provider-wrapper";

// For Sui Modal
import '@mysten/dapp-kit/dist/index.css';

interface VerifiedInfoProps {
  packageId: string;
  verifiedSrcUrl: string;
}

export const SuiVerifiedInfo: FC<VerifiedInfoProps> = ({
  packageId,
  verifiedSrcUrl,
}) => {
  return (
    <SuiProviderWrapper>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
        <p className="block sm:inline">Package {packageId} has been verified</p>
        <br />
        <p className="block sm:inline">
          You can download the verified source code{" "}
          <a href={verifiedSrcUrl} className="text-blue-600" download>
            here
          </a>
        </p>
      </div>
      <Tabs defaultValue="code">
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="interact">Interact</TabsTrigger>
        </TabsList>
        <TabsContent value="code">
          <CodeExplorer url={verifiedSrcUrl} />
        </TabsContent>
        <TabsContent value="interact">
          <SuiContractInteract packageId={packageId} />
        </TabsContent>
      </Tabs>
    </SuiProviderWrapper>
  );
};
