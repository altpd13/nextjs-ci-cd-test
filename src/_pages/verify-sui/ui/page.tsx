import { getSuiVerification } from "@/src/entities/verifications";
import {
  GetSuiVerificationRequestDto,
  GetSuiVerificationResponseDto,
} from "@/src/entities/verifications/api/types";
import { SuiNetwork } from "@/src/entities/verifications/model/types";
import { baseUrl } from "@/src/features/verify/api";
import { SuiVerifiedInfo } from "./sui-verified-info";
import SuiVerifyStepper from "./sui-verify-stepper";

export const SuiVerifyPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const network = searchParams?.network as SuiNetwork;
  const objectId = searchParams?.contractAddress;
  let isVerified = false;
  let verifiedSrcUrl = null;
  let initialStep = 0;
  let result = null;

  if (objectId) {
    result = await getSuiVerification({ network, packageId: objectId });
    if (result?.isVerified) {
      verifiedSrcUrl = result.verifiedSrcUrl;
      isVerified = result.isVerified;
    }
  }
  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="max-w-7xl w-full p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">
          Verify & Publish Contract Source Code
        </h1>
        <p className="text-center  mb-6">
          Source code verification provides transparency for users interacting
          with smart contracts.
        </p>
        <div className="flex w-full flex-col justify-center gap-4">
          {verifiedSrcUrl ? (
            <SuiVerifiedInfo
              packageId={objectId!}
              verifiedSrcUrl={verifiedSrcUrl}
            />
          ) : (
            <SuiVerifyStepper
              network={network}
              initialStep={initialStep}
              checkResult={result || undefined}
              packageId={objectId}
            />
          )}
        </div>
      </div>
    </div>
  );
};
