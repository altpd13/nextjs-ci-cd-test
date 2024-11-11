import axios from "axios";
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

// TODO: 추후 API URL을 env 파일로 분리해야 함

export const getAptosVerification = async () => {};
export const postAptosVerification = async () => {};

export const getSuiVerification = async (
  params: GetSuiVerificationRequestDto
): Promise<GetSuiVerificationResponseDto | null> => {
  const { network, packageId } = params;
  try {
    const response = await axios.get(
      `https://verify.welldonestudio.io/sui/verifications?network=${network}&packageId=${packageId}`,
      {
        headers: {
          accept: "application/json",
        },
      }
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
  params: PostSuiVerificationRequestBodyDto
): Promise<PostSuiVerificationResponseBodyDto | null> => {
  const { network, packageId, srcFileId } = params;
  try {
    const response = await axios.post(
      "https://verify.welldonestudio.io/sui/verifications",
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
      }
    );

    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};
export const getSuiSourceVerification = async (
  params: GetSuiVerificationSourceQueryRequestDto
): Promise<GetSuiVerificationSourceQueryResponseDto | null> => {
  const { chainId, packageId } = params;
  try {
    const response = await axios.get(
      `https://verify.welldonestudio.io/sui/verifications/sources/${chainId}/${packageId}`,
      {
        headers: {
          accept: "application/json",
        },
      }
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
  params: GetSuiVerificationModuleSourceQueryRequestDto
): Promise<GetSuiVerificationModuleSourceQueryResponseDto | null> => {
  const { chainId, packageId } = params;
  try {
    const response = await axios.get(
      `https://verify.welldonestudio.io/sui/verifications/module-sources/${chainId}/${packageId}`,
      {
        headers: {
          accept: "application/json",
        },
      }
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
  params: PostSuiVerificationSourceRequestBodyDto
): Promise<PostSuiVerificationSourceResponseDto | null> => {
  const { network, packageId, srcZipFile, srcFileId } = params;
  try {
    const formData = new FormData();
    formData.append("network", network);
    formData.append("packageId", packageId);
    formData.append("srcZipFile", multerFileToBlob(srcZipFile));
    // formData.append("srcFileId", srcFileId);

    const response = await axios.post("https://verify.welldonestudio.io/sui/verifications/sources", formData, {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getNeutronVerification = async () => {};
export const postNeutronVerification = async () => {};
