"use client";

import { FC, useEffect, useState } from "react";

import {
  SuiClient,
  SuiMoveNormalizedType,
  getFullnodeUrl,
} from "@mysten/sui/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { SuiNetwork } from "@/src/entities/verifications/model/types";

import {
  ConnectModal,
  createNetworkConfig,
  SuiClientProvider,
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSignTransaction,
  useSuiClient,
  WalletProvider,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ConnectButton, useAccounts } from "@mysten/dapp-kit";
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
  const { mutateAsync: signTransaction } = useSignTransaction();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

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
            elements: arg.map((a: any) => tx.pure(a)),
          });
        }
        return tx.pure(arg);
      }),
    };
    tx.moveCall(moveCallInput);
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
      arguments: [
        tx.object(
          "0x4f2686c00b3cf9bdc1db59ae2f65946c50dc84d0cf188be5e165fb7accb73e74",
        ),
        tx.pure.u8(1),
        tx.pure.u8(1),
        tx.pure.address(
          "0xc536b015c90274aa6a5fceda93a4459e25e7d94b25bfa4e61f445b4e39647f03",
        ),
      ],

      // arguments: args.map((arg, i) => {
      //   console.log(`@@@ moveCallTx arg ${i}`, arg);
      //   const parameter: any = func.parameters[i];
      //   if (
      //     parameter.Vector?.Struct &&
      //     !(
      //       parameter.Vector.Struct.address === "0x1" &&
      //       parameter.Vector.Struct.module === "string" &&
      //       parameter.Vector.Struct.name === "String"
      //     )
      //   ) {
      //     return tx.makeMoveVec({
      //       elements: arg.map((a: any) => tx.pure(a)),
      //     });
      //   }
      //   return tx.pure.string(arg);
      // }),
    });
    return tx;
  };

  const moveCall2 = (
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
            elements: arg.map((a: any) => tx.pure(a)),
          });
        }
        return tx.pure(arg);
      }),
    };
    tx.moveCall(moveCallInput);
    console.log(tx);
    return tx;
  };

  return (
    <>
      <ConnectModal
        trigger={
          <button disabled={!!currentAccount}>
            {" "}
            {currentAccount ? "Connected" : "Connect"}
          </button>
        }
        open={open}
        onOpenChange={(isOpen) => setOpen(isOpen)}
      />
      {currentAccount && <div>{currentAccount.address}</div>}
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
          <Button
            onClick={async () => {
              const txBlock = moveCallTxBlock(
                packageId,
                targetModuleName,
                targetFunc!,
                genericParameters,
                parameters,
              );
              const dapp = window.dapp as any;
              const txnHash: string[] = await dapp.request("sui", {
                method: "dapp:signAndSendTransaction",
                params: [txBlock.serialize()],
              });
              console.log(txnHash);

              // console.log(`@@@ client`, client);
              // const tx = moveCallTx(
              //   packageId,
              //   targetModuleName,
              //   targetFunc!,
              //   genericParameters,
              //   parameters,
              // );
              // if (!tx) {
              //   console.error(`tx is empty`);
              //   return;
              // }

              // ---------------------------------------------
              // const { bytes, signature, reportTransactionEffects } =
              //   await signTransaction({
              //     transaction: tx,
              //     chain: `sui:${network}`,
              //   });
              // const executeResult = await client.executeTransactionBlock({
              //   transactionBlock: bytes,
              //   signature,
              //   options: {
              //     showRawEffects: true,
              //   },
              // });
              //
              // console.log(`@@@ executeResult`, executeResult);

              // ---------------------------------------------
              // signAndExecuteTransaction(
              //   {
              //     transaction: tx,
              //     chain: "sui:devnet",
              //   },
              //   {
              //     onSuccess: (result) => {
              //       console.log("executed transaction", result);
              //       setDigest(result.digest);
              //     },
              //   },
              // );
            }}
          >
            Execute
          </Button>
        </div>
      )}
    </>
  );
};
