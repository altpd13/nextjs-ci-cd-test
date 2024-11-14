"use client";

import React, { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/ui";
import { CodeExplorer } from "./sui-code-explorer";
import { SuiContractInteract } from "./sui-contract-interact";
import SuiProviderWrapper from "./sui-provider-wrapper";
import Image from "next/image";

// For Sui Modal
import "@mysten/dapp-kit/dist/index.css";
import { SuiNetwork } from "@/src/entities/verifications/model/types";
import axios, { AxiosRequestConfig } from "axios";

interface VerifiedInfoProps {
  network: SuiNetwork;
  packageId: string;
  verifiedSrcUrl: string;
  walrusBlobId?: string;
}
const downloadFile = async () => {
  const response = await fetch(
    `https://aggregator.walrus-testnet.walrus.space/v1/${walrusBlobId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    },
  );

  if (!response.ok) {
    console.error("File download failed.");
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "WalrusFile.zip"; // 원하는 파일 이름 설정
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url); // 메모리 해제
};

// 호출

export const SuiVerifiedInfo: FC<VerifiedInfoProps> = ({
  network,
  packageId,
  verifiedSrcUrl,
  walrusBlobId,
}) => {
  return (
    <SuiProviderWrapper network={network}>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
        <p className="block sm:inline">Package {packageId} has been verified</p>
        <br />
        <p className="block sm:inline">
          <div style={{ display: "flex" }}>
            You can download the verified source code{" "}
            <p style={{ marginLeft: "0.5em", marginRight: "0.5em" }}> from </p>
            {walrusBlobId ? (
              <div>
                <button
                  className="text-blue-600"
                  style={{
                    border: "none",
                    padding: "0",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={async () => {
                    console.log(`walrusBlobId=${walrusBlobId}`);
                    const response = await axios.get(
                      `https://aggregator.walrus-testnet.walrus.space/v1/${walrusBlobId}`,
                      {
                        responseType: "blob", // 파일을 blob 형태로 가져옵니다.
                      },
                    );
                    console.log(`response`, response);

                    if (response.status !== 200) {
                      console.error("File download failed.");
                      return;
                    }

                    const url = window.URL.createObjectURL(
                      new Blob([response.data]),
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "WalrusFile.zip"; // 원하는 파일 이름 설정
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url); // 메모리 해제
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Image
                      src="/Walrus.png"
                      alt="Walrus Icon"
                      width={"40"}
                      height={"40"}
                    ></Image>
                    {walrusBlobId}
                  </div>
                </button>
              </div>
            ) : (
              <a
                href={verifiedSrcUrl}
                className="text-blue-600"
                download
                style={{ marginLeft: "0.5em" }}
              >
                here
              </a>
            )}
          </div>
        </p>
      </div>
      <Tabs defaultValue="code">
        <TabsList>
          <TabsTrigger value="code">
            Code
            {walrusBlobId && (
              <Image
                src="/Walrus.png"
                alt="Walrus Icon"
                width={"40"}
                height={"40"}
              />
            )}
          </TabsTrigger>
          <TabsTrigger value="interact">Interact</TabsTrigger>
        </TabsList>
        <TabsContent value="code">
          <CodeExplorer
            url={
              walrusBlobId
                ? `https://aggregator.walrus-testnet.walrus.space/v1/${walrusBlobId}`
                : verifiedSrcUrl
            }
          />
        </TabsContent>
        <TabsContent value="interact">
          <SuiContractInteract network={network} packageId={packageId} />
        </TabsContent>
      </Tabs>
    </SuiProviderWrapper>
  );
};
