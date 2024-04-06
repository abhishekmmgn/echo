import { useState } from "react";
import NewGroupForm from "./new-grp-form";
import { AddMembers } from "./add-members";
import { GroupType } from "@/types";

export default function NewGrp() {
  const [step, setStep] = useState(1);
  const [grpDetails, setGrpDetails] = useState<GroupType>({
    name: "",
    avatar: "",
    id: "",
  });
  return (
    <div>
      {step === 1 && (
        <NewGroupForm setStep={setStep} setGrpDetails={setGrpDetails} />
      )}
      {step === 2 && (
        <AddMembers avatar={grpDetails.avatar} id="" name={grpDetails.name} />
      )}
    </div>
  );
}
