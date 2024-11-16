"use client";

import React, { FC, useEffect, useState } from "react";
import { bcs } from "@mysten/sui/bcs";

import { getFullnodeUrl } from "@mysten/sui/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { SuiNetwork } from "@/src/entities/verifications/model/types";
import {
  ConnectModal,
  createNetworkConfig,
  useCurrentAccount,
  useDisconnectWallet,
  useSignTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { QueryClient } from "@tanstack/react-query";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui";
import { SuiFunc, SuiModule } from "../utils/sui-types";
import { Parameters } from "./parameters";
import {
  getModules,
  initGenericParameters,
  initParameters,
  isEmptyList,
} from "../utils/sui-helper";
import { Transaction } from "@mysten/sui/transactions";

const { networkConfig } = createNetworkConfig({
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

const queryClient = new QueryClient();

//to here
interface SuiContractInteractProps {
  network: SuiNetwork;
  packageId: string;
}

export const SuiContractInteract: FC<SuiContractInteractProps> = ({
  network,
  packageId,
}) => {
  //TODO: Add account owned Packages
  const [modules, setModules] = useState<SuiModule[]>([]);
  const [targetModuleName, setTargetModuleName] = useState<string>("");
  const [funcs, setFuncs] = useState<SuiFunc[]>([]);
  const [targetFunc, setTargetFunc] = useState<SuiFunc>();
  const [genericParameters, setGenericParameters] = useState<string[]>([]);
  const [parameters, setParameters] = useState<any[]>([]);
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const [open, setOpen] = useState(false);
  const { mutateAsync: signTransactionBlock } = useSignTransaction();
  const { mutate: disconnect } = useDisconnectWallet();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [txResult, setTxResult] = useState<any>();

  const initPackageCtx = async (packageId: string) => {
    try {
      console.log(currentAccount?.chains);
      const modules = await getModules(packageId, network);
      if (isEmptyList(modules)) {
        //TODO: add clean up
        return;
      }
      setModules([...modules]);
      const firstModule = modules[0];
      setTargetModuleName(firstModule.name);
      const entryFuncs = firstModule.exposedFunctions.filter((f) => f.isEntry);
      if (isEmptyList(entryFuncs)) {
        //TODO: add clean up
        return;
      }
      setFuncs([...entryFuncs]);

      const func = entryFuncs[0];
      setTargetFunc(func);
      setGenericParameters([...initGenericParameters(func.typeParameters)]);
      setParameters([...initParameters(func.parameters)]);
    } catch (err) {
      console.log("Init Package Error");
      console.error(err);
    }
  };

  const onChangeModuleName = async (moduleName: string) => {
    setTargetModuleName(moduleName);
    const moveModule = modules.find((m) => m.name === moduleName);
    if (!moveModule) {
      throw new Error(`Not Found Module ${moduleName}`);
    }

    const entryFuncs = moveModule.exposedFunctions.filter((f) => f.isEntry);
    setFuncs([...entryFuncs]);
    if (isEmptyList(entryFuncs)) {
      setTargetFunc(undefined);
      setGenericParameters([]);
      setParameters([]);
      return;
    }

    const func = entryFuncs[0];
    setTargetFunc(func);
    setGenericParameters([...initGenericParameters(func.typeParameters)]);
    setParameters([...initParameters(func.parameters)]);
  };

  const onChangeFuncName = (funcName: string) => {
    const func = funcs.find((f) => f.name === funcName);
    if (!func) {
      throw new Error(`Not Found Function ${funcName}`);
    }

    setTargetFunc(func);
    setGenericParameters([...initGenericParameters(func.typeParameters)]);
    setParameters([...initParameters(func.parameters)]);
  };

  useEffect(() => {
    initPackageCtx(packageId);
  }, []);

  const moveCallTxBlock = (
    packageId: string,
    moduleName: string,
    func: SuiFunc,
    typeArgs: string[],
    args: any[],
  ): TransactionBlock | undefined => {
    if (!currentAccount) {
      return;
    }
    const tx = new TransactionBlock();
    tx.setSender(currentAccount!.address);
    const moveCallInput = {
      target: `${packageId}::${moduleName}::${func.name}`,
      typeArguments: typeArgs,
      arguments: args.map((arg, i) => {
        const parameter: any = func.parameters[i];
        if (
          parameter.Vector?.Struct &&
          !(
            parameter.Vector.Struct.address === "0x1" &&
            parameter.Vector.Struct.module === "string" &&
            parameter.Vector.Struct.name === "String"
          )
        ) {
          return tx.makeMoveVec({
            objects: arg.map((a: any) => tx.pure(a)) as any,
          });
        }
        return tx.pure(arg);
      }),
    };
    tx.moveCall(moveCallInput as any);
    console.log(tx);
    return tx;
  };

  const moveCallTx = (
    packageId: string,
    moduleName: string,
    func: SuiFunc,
    typeArgs: string[],
    args: any[],
  ): Transaction | undefined => {
    if (!currentAccount) {
      return;
    }
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::${moduleName}::${func.name}`,
      arguments: args.map((arg, i) => {
        console.log(`@@@ moveCallTx arg ${i}`, arg);
        const parameter: any = func.parameters[i];
        if (
          parameter.Vector?.Struct &&
          !(
            parameter.Vector.Struct.address === "0x1" &&
            parameter.Vector.Struct.module === "string" &&
            parameter.Vector.Struct.name === "String"
          )
        ) {
          return tx.makeMoveVec({
            elements: arg.map((a: any) => tx.pure(a)),
          });
        } else if (parameter === "Bool") {
          return tx.pure.u8(arg);
        } else if (parameter === "U8") {
          return tx.pure.u8(arg);
        } else if (parameter === "U16") {
          return tx.pure.u16(arg);
        } else if (parameter === "U32") {
          return tx.pure.u32(arg);
        } else if (parameter === "U64") {
          return tx.pure.u64(arg);
        } else if (parameter === "U128") {
          return tx.pure.u128(arg);
        } else if (parameter === "U256") {
          return tx.pure.u256(arg);
        } else if (parameter.MutableReference?.Struct) {
          return tx.object(arg);
        } else if (parameter === "Address") {
          return tx.pure.address(arg);
        }

        // bcs.vector(bcs.string()).serialize(['hello'])
        return bcs.vector(bcs.string()).serialize(arg);
      }),
    });
    return tx;
  };
  const handleCopy = () => {
    if (currentAccount) {
      navigator.clipboard
        .writeText(currentAccount.address)
        .then(() => {
          setTooltipVisible(true); // 복사 성공 시 툴팁 표시
          setTimeout(() => setTooltipVisible(false), 2000); // 2초 후 툴팁 숨기기
        })
        .catch((err) => {
          console.error("Failed to copy address: ", err); // 복사 실패시 에러 로그
        });
    }
  };

  return (
    <>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "1em" }}
      >
        <div style={{ marginRight: "0.5em" }}>
          <ConnectModal
            trigger={
              <button
                className={`px-4 py-2 font-semibold text-white rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  currentAccount
                    ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                    : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                }`}
                onClick={() => {
                  if (currentAccount) {
                    disconnect();
                  }
                }}
                aria-label={
                  currentAccount ? "Disconnect account" : "Connect to account"
                }
              >
                {currentAccount
                  ? `Disconnect (${currentAccount.chains.map((c) => {
                      return c.replace("sui:", "");
                    })})`
                  : "Connect"}
              </button>
            }
            open={open}
            onOpenChange={(isOpen) => setOpen(isOpen)}
          />
        </div>
        {currentAccount && (
          <div style={{ display: "flex" }}>
            <div
              className={`${
                currentAccount
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-500"
              } p-4 rounded-lg font-semibold text-sm flex items-center justify-between`}
            >
              <span>
                {currentAccount
                  ? currentAccount.address
                  : "No account connected"}
              </span>
              {currentAccount && (
                <div className="relative">
                  <button
                    onClick={handleCopy}
                    className="ml-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    aria-label="Copy address"
                  >
                    Copy
                  </button>
                  {/* 툴팁 */}
                  {tooltipVisible && (
                    <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2">
                      Address copied!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {modules[0] && (
        <div className="interact-container flex row gap-5">
          <div className="modules-functions-container flex col gap-5">
            <Select
              defaultValue={modules[0].name}
              onValueChange={onChangeModuleName}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((moveModule) => {
                  return (
                    <SelectItem value={moveModule.name} key={moveModule.name}>
                      {moveModule.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {funcs[0] && (
              <Select
                defaultValue={funcs[0].name}
                onValueChange={onChangeFuncName}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Function" />
                </SelectTrigger>
                <SelectContent>
                  {funcs.map((func) => {
                    return (
                      <SelectItem value={func.name} key={func.name}>
                        {func.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="parameter-container">
            {targetFunc && (
              <Parameters
                func={targetFunc}
                setGenericParameters={setGenericParameters}
                setParameters={setParameters}
              ></Parameters>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "start",
            }}
          >
            <Button
              onClick={async () => {
                // -------------- WELLDONE Wallet ----------------------
                // const txBlock = moveCallTxBlock(
                //   packageId,
                //   targetModuleName,
                //   targetFunc!,
                //   genericParameters,
                //   parameters,
                // );
                // const dapp = window.dapp as any;
                // const txnHash: string[] = await dapp.request("sui", {
                //   method: "dapp:signAndSendTransaction",
                //   params: [txBlock.serialize()],
                // });
                // console.log(txnHash);

                // -------------- SUI Wallet ----------------------

                const tx = moveCallTx(
                  packageId,
                  targetModuleName,
                  targetFunc!,
                  genericParameters,
                  parameters,
                );
                if (!tx) {
                  console.error(`tx is empty`);
                  return;
                }

                const signature = await signTransactionBlock({
                  transaction: tx,
                  chain: `sui:${network}`,
                });

                const executeResult = await client.executeTransactionBlock({
                  transactionBlock: signature.bytes,
                  signature: signature.signature,
                  options: {
                    showEffects: true,
                    showObjectChanges: true,
                  },
                });
                console.log(`@@@ executeResult`, executeResult);
                setTxResult({ ...executeResult });
              }}
            >
              Execute
            </Button>
            {
              <div
                className="flex items-center"
                style={{ marginLeft: "1em", marginTop: "0.5em" }}
              >
                {txResult?.digest ? (
                  <a
                    href={`https://suiscan.xyz/${network}/tx/${txResult.digest}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    View Transaction ({txResult.digest.slice(0, 8)}...
                    {txResult.digest.slice(-8)})
                  </a>
                ) : (
                  <span>No transaction found</span>
                )}
              </div>
            }
          </div>
        </div>
      )}
    </>
  );
};
