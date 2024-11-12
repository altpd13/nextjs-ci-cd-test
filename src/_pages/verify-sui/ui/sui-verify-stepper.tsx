"use client";

import { Step, StepItem, Stepper } from "@/src/widgets/Stpper";
import { FC, useState } from "react";
import SuiContractVerifyForm from "./sui-contract-verify-form";
import { SuiNetwork } from "@/src/entities/verifications/model/types";
import SuiProviderWrapper from "./sui-provider-wrapper";
import ResultVerifySui from "./result-verify-sui";

const steps = [
  { label: "Select Package" },
  { label: "Verify" },
] satisfies StepItem[];

interface SuiVeifyStepperProps {
  network: SuiNetwork;
  packageId?: string;
  initialStep: number;
  checkResult: any;
}

export type SuiPackageInfo = {
  network: SuiNetwork;
  packageId: string;
  packageFile: File | null;
  srcFileId?: string;
};

const SuiVerifyStepper: FC<SuiVeifyStepperProps> = ({
  network,
  packageId,
  initialStep,
  checkResult,
}) => {
  const [loading, setLoading] = useState(false);
  const [packageInfo, setPackageInfo] = useState<SuiPackageInfo>({
    network: network,
    packageId: packageId || "",
    packageFile: null,
  });
  return (
    <SuiProviderWrapper network={network}>
      <Stepper
        initialStep={initialStep}
        steps={steps}
        state={loading ? "loading" : undefined}
        scrollTracking
      >
        {steps.map((stepProps, index) => {
          return (
            <Step key={stepProps.label} {...stepProps}>
              {index === 0 && (
                <SuiContractVerifyForm
                  network={network}
                  packageInfo={packageInfo}
                  setPackageInfo={setPackageInfo}
                />
              )}
              {index === 1 && (
                <ResultVerifySui
                  packageInfo={packageInfo}
                  isRemixSrcUploaded={checkResult?.isRemixSrcUploaded || false}
                ></ResultVerifySui>
              )}
            </Step>
          );
        })}
        {/* <ResultVerify
        contractInfo={contractInfo}
        isRemixSrcUploaded={
          chain === "arbitrum"
            ? (checkResult as StylusVerificationCheckResultDto)
                .isRemixSrcUploaded
            : false
        }
      /> */}
      </Stepper>
    </SuiProviderWrapper>
  );
};

export default SuiVerifyStepper;
