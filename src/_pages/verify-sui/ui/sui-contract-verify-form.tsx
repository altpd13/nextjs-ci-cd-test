"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import { InputFile } from "../../verify/ui/input-file";
import { Button, Input, Label } from "@/src/shared/ui";
import { SuiPackageInfo } from "./sui-verify-stepper";
import { useSuiClient } from "@mysten/dapp-kit";
import { SuiNetwork } from "@/src/entities/verifications/model/types";
import { useStepper } from "@/src/widgets/Stpper/lib/use-stepper";

interface SuiContractVerifyFormProps {
  network: SuiNetwork;
  packageInfo: SuiPackageInfo;
  setPackageInfo: Dispatch<SetStateAction<SuiPackageInfo>>;
  isRemixSrcUploaded?: boolean;
}

const SuiContractVerifyForm: FC<SuiContractVerifyFormProps> = ({
  network,
  packageInfo,
  setPackageInfo,
}) => {
  const [isPackageExists, setIsPackageExists] = useState<boolean>(true);
  const suiClient = useSuiClient();
  const { nextStep } = useStepper();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // e.target.files
      setPackageInfo((prev) => ({
        ...prev,
        packageFile: e.target.files?.[0] || null,
      }));
      console.log(e.target.files);
    }
  };

  const handlePackageIdChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setPackageInfo((prevValue) => ({
        ...prevValue,
        packageId: event.target.value,
      }));
      const suiResult = await suiClient.getObject({
        id: event.target.value,
      });
      if (suiResult.error) {
        setIsPackageExists(false);
      } else {
        setIsPackageExists(true);
      }
    } catch (e) {
      console.log(e);
    }
    setPackageInfo((prevValue) => ({
      ...prevValue,
      packageId: event.target.value,
    }));
  };
  return (
    <div>
      <div>
        <Label htmlFor="package-id" className="block text-sm font-medium ">
          Please enter the Package ID you would like to verify
        </Label>
        {!isPackageExists ? <div>Please check package ID</div> : null}
        <Input
          type="text"
          id="package-id"
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="0x"
          value={packageInfo.packageId}
          onChange={handlePackageIdChange}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        {packageInfo.packageFile ? null : (
          <Label htmlFor="package-file" className="block text-sm font-medium ">
            Please upload source code of package
          </Label>
        )}
        <Input id="picture" type="file" onChange={handleFileChange} />
        {packageInfo.packageFile && (
          <Label htmlFor="picture" className="text-sm">
            {/* TODO: Find the way for file */}
            {packageInfo.packageFile.name}
          </Label>
        )}
      </div>
      <Button
        disabled={!isPackageExists}
        onClick={() => {
          nextStep();
        }}
      >
        Verify
      </Button>
    </div>
  );
};

export default SuiContractVerifyForm;
