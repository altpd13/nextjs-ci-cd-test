"use client";

import { Step, StepItem, Stepper } from "@/src/widgets/Stpper";
import { FC, useState } from "react";
import SuiContractVerifyForm from "./sui-contract-verify-form";
import { SuiNetwork } from "@/src/entities/verifications/model/types";
import SuiProviderWrapper from "./sui-provider-wrapper";

const steps = [
  { label: "Select Package" },
  { label: "Verify & Publish" },
] satisfies StepItem[];

interface SuiVeifyStepperProps {
  network: SuiNetwork;
  packageId?: string;
  initialStep: number;
  checkResult: any;
}

export type SuiPackageInfo = {
  packageId: string;
  packageFile: File | null;
};

const SuiVerifyStepper: FC<SuiVeifyStepperProps> = ({
  network,
  packageId,
  initialStep,
  checkResult,
}) => {
  const [loading, setLoading] = useState(false);
  const [packageInfo, setPackageInfo] = useState<SuiPackageInfo>({
    packageId: packageId || "",
    packageFile: null,
  });
  return (
    <SuiProviderWrapper>
      <Stepper
        initialStep={initialStep}
        steps={steps}
        state={loading ? "loading" : undefined}
        scrollTracking
      >
        {steps.map((stepProps, index) => {
          return (
            //Steps needed for Sui verification
            // 1. upload src with package Id
            // - must check if src was uploaded
            // - must check if packageId is valid
            // 1-1.
            // source
            // 2. verification result
            <Step key={stepProps.label} {...stepProps}>
              {index === 0 && (
                <SuiContractVerifyForm
                  network={network}
                  packageInfo={packageInfo}
                  setPackageInfo={setPackageInfo}
                />
              )}
              {/* {index === 1 && (
              <ContractVerifyForm
                contractInfo={contractInfo}
                setContractInfo={setContractInfo}
                isRemixSrcUploaded={
                  chain === "arbitrum"
                    ? (checkResult as StylusVerificationCheckResultDto)
                        .isRemixSrcUploaded
                    : false
                }
              />
            )} */}
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
