import { Dispatch, FC, SetStateAction } from "react";
import { InputFile } from "../../verify/ui/input-file";
import { Input, Label } from "@/src/shared/ui";
import { SuiPackageInfo } from "./sui-verify-stepper";
import { useSuiClient } from "@mysten/dapp-kit";
import { SuiNetwork } from "@/src/entities/verifications/model/types";

interface SuiContractVerifyFormProps {
  network: SuiNetwork;
  packageInfo: SuiPackageInfo;
  setPackageInfo: Dispatch<SetStateAction<SuiPackageInfo>>;
}

const SuiContractVerifyForm: FC<SuiContractVerifyFormProps> = ({
  network,
  packageInfo,
  setPackageInfo,
}) => {
  const suiClient = useSuiClient();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // e.target.files
      console.log(e.target.files);
    }
  };

  const handlePackageIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <div>
      <div>
        <Label htmlFor="package-id" className="block text-sm font-medium ">
          Please enter the Contract Address you would like to verify
        </Label>
        <Input
          type="text"
          id="package-id"
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="0x"
          value={packageInfo.packageId}
          onChange={(e) =>
            setPackageInfo((prevValue) => ({
              ...prevValue,
              packageId: e.target.value,
            }))
          }
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input id="picture" type="file" onChange={handleFileChange} />
        {packageInfo.packageFile && (
          <Label htmlFor="picture" className="text-sm">
            {packageInfo.packageFile.name}
          </Label>
        )}
      </div>
    </div>
  );
};

export default SuiContractVerifyForm;
