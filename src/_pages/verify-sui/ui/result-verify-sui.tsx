import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { SuiPackageInfo } from "./sui-verify-stepper";
import { useStepper } from "@/src/widgets/Stpper";
import {
  postSuiModuleVerification,
  postSuiSourceVerification,
} from "@/src/entities/verifications";
import {
  PostSuiVerificationRequestBodyDto,
  PostSuiVerificationSourceRequestBodyDto,
} from "@/src/entities/verifications/api/types";
import { Button } from "@/src/shared/ui";

interface ResultVerifySuiProps {
  packageInfo: SuiPackageInfo;
  isRemixSrcUploaded?: boolean;
}

type Status = "not_started" | "loading" | "done" | "error";

const ResultVerifySui: FC<ResultVerifySuiProps> = ({
  packageInfo,
  isRemixSrcUploaded,
}) => {
  const { prevStep } = useStepper();
  const [uploadStatus, setUploadStatus] = useState<Status>("not_started");
  const [verifyStatus, setVerifyStatus] = useState<Status>("not_started");
  const [verifyErrorMsg, setVerifyErrorMsg] = useState<string | null>(null);

  const uplaodSourceFiles = useCallback(async () => {
    const params: PostSuiVerificationSourceRequestBodyDto = {
      network: packageInfo.network,
      packageId: packageInfo.packageId,
      srcZipFile: packageInfo.packageFile as unknown as Express.Multer.File,
      srcFileId: packageInfo.srcFileId!,
    };
    const result = await postSuiSourceVerification(params);
    console.log(result);
    return result;
  }, []);

  const verifyPackage = useCallback(async (srcFileId?: string) => {
    const params: PostSuiVerificationRequestBodyDto = {
      network: packageInfo.network,
      packageId: packageInfo.packageId,
      srcFileId: packageInfo.srcFileId!,
    };
    const result = await postSuiModuleVerification(params);
    console.log(result);
    return result;
  }, []);

  useEffect(() => {
    (async () => {
      console.log(isRemixSrcUploaded);
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
    <div>
      <Button
        onClick={() => {
          prevStep();
        }}
      ></Button>
    </div>
  );
};

export default ResultVerifySui;
