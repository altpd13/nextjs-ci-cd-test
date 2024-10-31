import { SuiNetwork } from "@/src/entities/verifications/model/types";
import {
  SuiClient,
  SuiMoveNormalizedType,
  getFullnodeUrl,
} from "@mysten/sui/client";

export function txCtxRemovedParameters(parameters: SuiMoveNormalizedType[]) {
  console.log("txCtxRemovedParameters parameters", parameters);
  return parameters.filter(
    (p: any, index: number) => !(index === parameters.length - 1 && isTxCtx(p))
  );
}

function isTxCtx(p: any) {
  return (
    (p.MutableReference?.Struct?.address === "0x2" &&
      p.MutableReference?.Struct?.module === "tx_context" &&
      p.MutableReference?.Struct?.name === "TxContext") ||
    (p.Reference?.Struct?.address === "0x2" &&
      p.Reference?.Struct?.module === "tx_context" &&
      p.Reference?.Struct?.name === "TxContext")
  );
}

export function parseArgVal(
  argVal: any,
  argType: string,
  u8parseType?: string
) {
  if (argType === "Bool") {
    return argVal;
  }

  if (argType === "U8") {
    if (u8parseType === "string") {
      return argVal;
    }

    if (u8parseType === "hex") {
      return argVal;
    }

    return ensureNumber(argVal);
  }

  if (argType === "U8" || argType === "U16" || argType === "U32") {
    return ensureNumber(argVal);
  }

  if (argType === "U64" || argType === "U128" || argType === "U256") {
    return ensureBigInt(argVal).toString();
  }

  if (argType === "Address") {
    return argVal;
  }

  return argVal;
}

export function ensureBigInt(val: number | bigint | string): bigint {
  assertType(val, ["number", "bigint", "string"]);
  return BigInt(val);
}

export function ensureNumber(val: number | string): number {
  assertType(val, ["number", "string"]);
  if (typeof val === "number") {
    return val;
  }

  const res = Number.parseInt(val, 10);
  if (Number.isNaN(res)) {
    throw new Error("Invalid number string.");
  }

  return res;
}

function assertType(val: any, types: string[] | string, message?: string) {
  if (!types?.includes(typeof val)) {
    throw new Error(
      message ||
        `Invalid arg: ${val} type should be ${
          types instanceof Array ? types.join(" or ") : types
        }`
    );
  }
}

const PROVIDER_MAINNET = new SuiClient({
  url: getFullnodeUrl("mainnet"),
});

const PROVIDER_TESTNET = new SuiClient({
  url: getFullnodeUrl("testnet"),
});

const PROVIDER_DEVNET = new SuiClient({
  url: getFullnodeUrl("devnet"),
});

export function getProvider(chainId: SuiNetwork): SuiClient {
  if (chainId === "mainnet") {
    return PROVIDER_MAINNET;
  }

  if (chainId === "testnet") {
    return PROVIDER_TESTNET;
  }

  if (chainId === "devnet") {
    return PROVIDER_DEVNET;
  }

  throw new Error(`Invalid ChainId=${chainId}`);
}

export async function getModules(packageId: string) {
  const suiMoveNormalizedModules = await getProvider(
    "testnet"
  ).getNormalizedMoveModulesByPackage({
    package: packageId,
  });
  return Object.keys(suiMoveNormalizedModules).map((moduleName) => {
    const moveModule = suiMoveNormalizedModules[moduleName];
    const suiFuncs = Object.keys(moveModule.exposedFunctions).map(
      (funcName) => {
        const func = moveModule.exposedFunctions[funcName];
        return {
          name: funcName,
          ...func,
        };
      }
    );

    const suiStructs = Object.keys(moveModule.structs).map((structName) => {
      const struct = moveModule.structs[structName];
      return {
        name: structName,
        ...struct,
      };
    });
    return {
      fileFormatVersion: moveModule.fileFormatVersion,
      address: moveModule.address,
      name: moveModule.name,
      friends: moveModule.friends,
      exposedFunctions: suiFuncs,
      structs: suiStructs,
    };
  });
}

export function isEmptyList(list: unknown): boolean {
  return !Array.isArray(list) || list.length === 0;
}

export function initGenericParameters(typeParameters: any[]) {
  return new Array(typeParameters.length);
}

export function initParameters(parameters: SuiMoveNormalizedType[]) {
  return new Array(txCtxRemovedParametersLen(parameters));
}

export function txCtxRemovedParametersLen(parameters: SuiMoveNormalizedType[]) {
  return parameters.filter(
    (parameter: any, index: number) =>
      !(index === parameters.length - 1 && isTxCtx(parameter))
  ).length;
}
