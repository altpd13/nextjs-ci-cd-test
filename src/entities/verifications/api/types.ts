import type {
  AptosNetwork,
  NeutronChainId,
  NeutronDeployHistorySingle,
  NeutronSchema,
  NeutronSourceCode,
  NeutronVerification,
  SuiModuleSourceCode,
  SuiNetwork,
  SuiSourceCode,
  SuiVerificationModule,
  VerificationStatus,
} from "../model/types";

// aptos/verifications?network=testnet&account=0xfd7c9c35a48cfcb4cefb9c7ebfa6ecf15d5d0ff53404ad06df321a330cbfa34a&moduleName=message
export type GetAptosVerificationRequestDto = {
  account: string;
  network: AptosNetwork;
  moduleName: string;
};
export type GetAptosVerificationResponseDto = {
  network: AptosNetwork;
  account: string;
  moduleName: string;
  isRemixSrcUploaded: boolean;
  errMsg?: string;
  status?: VerificationStatus;
};
// aptos/verifications
export type PostAptosVerificationRequestDto = {
  account: string;
  network: AptosNetwork;
  moduleName: string;
};
export type PostAptosVerificationResponseDto = {
  network: AptosNetwork;
  account: string;
  moduleName: string;
  errMsg?: string;
  status?: VerificationStatus;
  onChainByteCode?: string;
  compiledByteCode?: string;
};

// sui/verifications?network=mainnet&packageId=0xc948e62bc2e632d7107717d23ff05872e7c847e2c78851af37885c4f54bef0c0
export type GetSuiVerificationRequestDto = {
  network: SuiNetwork; // mainnet
  packageId: string; // 0xc948e62bc2e632d7107717d23ff05872e7c847e2c78851af37885c4f54bef0c0
};
export type GetSuiVerificationResponseDto = {
  network: SuiNetwork; // mainnet
  packageId: string; // 0xc948e62bc2e632d7107717d23ff05872e7c847e2c78851af37885c4f54bef0c0
  isVerified: boolean;
  isRemixSrcUploaded: boolean;
  walrusBlobId?: string | null;
  verifiedSrcUrl: string | null; // https://verification-storage.com/sui/mainnet/0xc948e62bc2e632d7107717d23ff05872e7c847e2c78851af37885c4f54bef0c0/1694998406166/1694998406166.zip
  errMsg: string | null; // Source code was not uploaded.
};
// sui/verifications
export type PostSuiVerificationRequestBodyDto = {
  network: SuiNetwork; // mainnet
  packageId: string; // 0xc948e62bc2e632d7107717d23ff05872e7c847e2c78851af37885c4f54bef0c0
  srcFileId: string; // 1695022436873
};
export type PostSuiVerificationResponseBodyDto = {
  network: SuiNetwork; // mainnet
  packageId: string; // 0xc948e62bc2e632d7107717d23ff05872e7c847e2c78851af37885c4f54bef0c0
  verifiedSrcUrl: string; // https://verification-storage.com/sui/mainnet/0xc948e62bc2e632d7107717d23ff05872e7c847e2c78851af37885c4f54bef0c0/1695022436873/1695022436873.zip
  errMsg: string | null; // Source code was not uploaded.
  modules: SuiVerificationModule[];
};
// sui/verifications/sources/testnet/0x7ae856e83f32de66ced965efaefef9746413afdaae389a71a5be6e37d1803822
export type GetSuiVerificationSourceQueryRequestDto = {
  chainId: SuiNetwork;
  packageId: string;
};
export type GetSuiVerificationSourceQueryResponseDto = {
  isSuccess: boolean;
  errMsg: string; // 문제가 없을 땐 ''
  sourceCodes: SuiSourceCode[];
};
// sui/verifications/module-sources/testnet/0x7ae856e83f32de66ced965efaefef9746413afdaae389a71a5be6e37d1803822
export type GetSuiVerificationModuleSourceQueryRequestDto = {
  chainId: SuiNetwork;
  packageId: string;
};
export type GetSuiVerificationModuleSourceQueryResponseDto = {
  isSuccess: boolean;
  errMsg: string; // 문제가 없을 땐 ''
  sourceCodes: SuiModuleSourceCode[];
  // example
  // { my_module_01: 'module my_first_package::my_module_01 {\n\n',
  // my_module_02: 'module my_first_package::my_module_02 {\n\n', }
};
// sui/verifications/sources
export type PostSuiVerificationSourceRequestBodyDto = {
  network: SuiNetwork;
  packageId: string;
  srcZipFile: File;
  srcFileId: string;
};
export type PostSuiVerificationSourceResponseDto = {
  srcFileId: string; // 1695022436873
};

// verifications/neutron
export type PostNeutronVerificationRequestBodyDto = {
  chainId: NeutronChainId;
  contractAddress: string;
};
export type PostNeutronVerificationResponseDto = {
  status: string; // '0'
  message: string; // 'OK'
  result: NeutronVerification;
};
// deploy-histories?chainId=neutron-1&offset=0&fetchSize=10
export type GetNeutronDepolyHistoriesRequestDto = {
  chainId: NeutronChainId;
  offset: number;
  fetchSize: number;
};
export type GetNeutronDepolyHistoriesResponseDto = {
  id: number;
  chainId: string;
  account: string;
  contractAddress: string;
};
// deploy-histories/neutron-1?contract=neutron19qdpnkxmrh8p6emrtf6303pdzclhxhsr8mrzle4lmp2lqvs22hpqqt90gw
export type GetNeutronDepolyHistoriesSingleRequestDto = {
  chainId: NeutronChainId;
  contract: string;
};
export type GetNeutronDepolyHistoriesSingleResponseDto =
  NeutronDeployHistorySingle;
// source-codes/neutron-1?contract=neutron18vgsz69fd8ceaxtx0qkduprvfajxy348hlfdhllwvsu6efn3z4sst4gkat
export type GetNeutronSourceCodesRequestDto = {
  chainId: NeutronChainId;
  contract: string;
};
export type GetNeutronSourceCodesResponseDto = {
  isSuccess: boolean;
  errMsg: string; // 문제가 없을 땐 ''
  sourceCodes: NeutronSourceCode[];
};
// schemas/neutron-1?contract=neutron18vgsz69fd8ceaxtx0qkduprvfajxy348hlfdhllwvsu6efn3z4sst4gkat
export type GetNeutronSchemasRequestDto = {
  chainId: NeutronChainId;
  contract: string;
};
export type GetNeutronSchemasResponseDto = {
  isSuccess: boolean;
  errMsg: string; // 문제가 없을 땐 ''
  sourceCodes: NeutronSchema[];
};
