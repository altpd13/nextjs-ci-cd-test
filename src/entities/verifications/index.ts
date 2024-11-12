import axios, { AxiosRequestConfig } from "axios";
import type {
  GetSuiVerificationModuleSourceQueryRequestDto,
  GetSuiVerificationModuleSourceQueryResponseDto,
  GetSuiVerificationRequestDto,
  GetSuiVerificationResponseDto,
  GetSuiVerificationSourceQueryRequestDto,
  GetSuiVerificationSourceQueryResponseDto,
  PostSuiVerificationRequestBodyDto,
  PostSuiVerificationResponseBodyDto,
  PostSuiVerificationSourceRequestBodyDto,
  PostSuiVerificationSourceResponseDto,
} from "./api/types";
import { multerFileToBlob } from "@/src/shared/utils/multerFileToBlob";
import { baseUrl } from "@/src/features/verify/api";

// TODO: 추후 API URL을 env 파일로 분리해야 함

export const getAptosVerification = async () => {};
export const postAptosVerification = async () => {};

export const getSuiVerification = async (
  params: GetSuiVerificationRequestDto,
): Promise<GetSuiVerificationResponseDto | null> => {
  const { network, packageId } = params;
  try {
    const response = await axios.get(
      `${baseUrl}/sui/verifications?network=${network}&packageId=${packageId}`,
    );
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};
export const postSuiModuleVerification = async (
  params: PostSuiVerificationRequestBodyDto,
): Promise<PostSuiVerificationResponseBodyDto | null> => {
  const { network, packageId, srcFileId } = params;
  try {
    const response = await axios.post(
      `${baseUrl}/sui/verifications`,
      {
        network,
        packageId,
        srcFileId,
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 201) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};
export const getSuiSourceVerification = async (
  params: GetSuiVerificationSourceQueryRequestDto,
): Promise<GetSuiVerificationSourceQueryResponseDto | null> => {
  const { chainId, packageId } = params;
  try {
    const response = await axios.get(
      `${baseUrl}/sui/verifications/sources/${chainId}/${packageId}`,
    );
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};
export const getSuiModuleSourceVerification = async (
  params: GetSuiVerificationModuleSourceQueryRequestDto,
): Promise<GetSuiVerificationModuleSourceQueryResponseDto | null> => {
  const { chainId, packageId } = params;
  try {
    const response = await axios.get(
      `${baseUrl}/sui/verifications/module-sources/${chainId}/${packageId}`,
    );
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};
export const postSuiSourceVerification = async (
  params: PostSuiVerificationSourceRequestBodyDto,
): Promise<PostSuiVerificationSourceResponseDto | null> => {
  console.log(`!!! postSuiSourceVerification`);
  const { network, packageId, srcZipFile, srcFileId } = params;
  try {
    const formData = new FormData();
    formData.append("network", network);
    formData.append("packageId", packageId);
    formData.append("srcZipFile", srcZipFile);
    // formData.append("srcFileId", srcFileId);
    const response = await axios.post(
      `${baseUrl}/sui/verifications/sources`,
      formData,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status === 201) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getNeutronVerification = async () => {};
export const postNeutronVerification = async () => {};
