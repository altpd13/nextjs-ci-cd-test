import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "@/src/shared/lib/utils";
import { SuiPackageInfo } from "./sui-verify-stepper";
import { useStepper } from "@/src/widgets/Stpper";
import {
  postSuiModuleVerification,
  postSuiSourceVerification,
} from "@/src/entities/verifications";
import {
  PostSuiVerificationRequestBodyDto,
  PostSuiVerificationResponseBodyDto,
  PostSuiVerificationSourceRequestBodyDto,
} from "@/src/entities/verifications/api/types";
import { Button } from "@/src/shared/ui";
import { Loader2, CircleCheck, Circle, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { result } from "lodash";

interface ResultVerifySuiProps {
  packageInfo: SuiPackageInfo;
  isRemixSrcUploaded?: boolean;
}

type Status = "not_started" | "loading" | "done" | "error";

const ResultVerifySui: FC<ResultVerifySuiProps> = ({
  packageInfo,
  isRemixSrcUploaded,
}) => {
  const { currentStep } = useStepper();
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState<Status>("not_started");
  const [verifyStatus, setVerifyStatus] = useState<Status>("not_started");
  const [verifyErrorMsg, setVerifyErrorMsg] = useState<string | null>(null);
  //TODO: Change Type
  const [verifiedResult, setVerifiedResult] = useState<any>(null);
  const uploadStatusIcon = useMemo(() => {
    switch (uploadStatus) {
      case "not_started":
        return <Circle />;
      case "loading":
        return <Loader2 className={cn("animate-spin")} />;
      case "done":
        return <CircleCheck color="green" />;
      case "error":
        return <CircleX color="red" />;
    }
  }, [uploadStatus]);

  const verifyStatusIcon = useMemo(() => {
    switch (verifyStatus) {
      case "not_started":
        return <Circle />;
      case "loading":
        return <Loader2 className={cn("animate-spin")} />;
      case "done":
        return <CircleCheck color="green" />;
      case "error":
        return <CircleX color="red" />;
    }
  }, [verifyStatus]);

  const uplaodSourceFiles = useCallback(async () => {
    setUploadStatus("loading");
    const params: PostSuiVerificationSourceRequestBodyDto = {
      network: packageInfo.network,
      packageId: packageInfo.packageId,
      srcZipFile: packageInfo.packageFile!,
      srcFileId: packageInfo.srcFileId!,
    };
    const result = await postSuiSourceVerification(params);
    setUploadStatus("done");
    if (result === null) {
      setUploadStatus("error");
    }
    return result;
  }, [packageInfo]);

  const verifyPackage = useCallback(
    async (srcFileId?: string) => {
      setVerifyStatus("loading");

      const params: PostSuiVerificationRequestBodyDto = {
        network: packageInfo.network,
        packageId: packageInfo.packageId,
        srcFileId: srcFileId!,
      };
      const result = await postSuiModuleVerification(params);
      if (result && result.errMsg !== null) {
        setVerifyStatus("error");
      }
      setVerifiedResult(result);
      setVerifyStatus("done");
      if (result === null) {
        setVerifyStatus("error");
      }
      return result;
    },
    [packageInfo]
  );

  useEffect(() => {
    (async () => {
      if (isRemixSrcUploaded) {
        await verifyPackage();
      } else {
        const result = await uplaodSourceFiles();
        if (result && result.srcFileId) {
          await verifyPackage(result.srcFileId);
        }
      }
    })();
  }, []);
  return (
    <>
      {currentStep.label === "Verify" && (
        <div className="flex flex-col mx-2 my-4">
          {!isRemixSrcUploaded && (
            <div className="w-full flex gap-2 my-4">
              {uploadStatusIcon}
              <p>Uploading Source Files</p>
            </div>
          )}
          <div className="w-full flex gap-2 my-4">
            {verifyStatusIcon}
            <p>Verifying</p>
          </div>
          {verifyStatus === "error" && (
            <p className="text-red-500 text-sm">{verifyErrorMsg}</p>
          )}
          {verifyStatus === "done" && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <p className="block sm:inline">
                Package {verifiedResult.packageId} has been verified
              </p>
              <br />
              <p className="block sm:inline">
                You can download the verified source code{" "}
                <a
                  href={verifiedResult.verifiedSrcUrl}
                  className="text-blue-600"
                  download
                >
                  here
                </a>
              </p>
              <Button
                onClick={() => {
                  console.log("he);
                  router.push(
                    `/verify/sui?chain=sui&network=${verifiedResult.network}&contractAddress=${verifiedResult.packageId}`
                  );
                }}
              >
                Go Checkout the Source Code
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ResultVerifySui;
