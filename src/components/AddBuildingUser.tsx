import React, { HTMLAttributes, useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

interface AddNewUserProps extends HTMLAttributes<HTMLDivElement> {
  buildingId: number;
  admin: boolean;
}

interface AdminObject {
  admin: boolean;
  none: boolean;
}

interface OutcomeObject {
  success: boolean;
  successMsg: string;
  errorMsg: string;
}

export const AddBuildingUser: React.FC<AddNewUserProps> = (props) => {
  const [newUserEmail, setNewUserEmail] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const [adminStatus, setAdminStatus] = useState<boolean | undefined>(
    undefined
  );
  const [fieldError, setFieldError] = useState<boolean>(false);
  const [complete, setComplete] = useState<OutcomeObject>({
    success: true,
    successMsg: "User added successfuly!",
    errorMsg: "",
  });
  const [completeDialog, setCompleteDialog] = useState<boolean>(false);

  const handleSelect = (value: string) => {
    const isAdmin: AdminObject = {
      admin: true,
      none: false,
    };
    setAdminStatus(isAdmin[value as keyof AdminObject]);
  };

  const handleSubmit = () => {
    const data = {
      buildingId: props.buildingId,
      newUserEmail: newUserEmail,
      admin: adminStatus,
    };
    console.log(adminStatus, newUserEmail);
    if (adminStatus !== undefined && newUserEmail.length > 0) {
      setFieldError(false);
      axios
        .post(process.env.REACT_APP_BACKEND_URL + "/buildings/user", data)
        .then(() => {
          setCompleteDialog(true);
        })
        .catch((error) => {
          console.log(error);
          const completeFailed = { ...complete };
          completeFailed.success = false;
          completeFailed.errorMsg = error.response.data.msg;
          setComplete(completeFailed);
          setCompleteDialog(true);
        });
    } else {
      setFieldError(true);
    }
  };

  const handleSuccess = () => {
    if (complete.success) {
      setNewUserEmail("");
    }
    setCompleteDialog(false);
  };

  return (
    <div>
      <Dialog open={completeDialog} onOpenChange={setCompleteDialog}>
        <DialogContent className="w-[50%]">
          <DialogTitle>
            {complete.success ? "Success!" : "Looks like something went wrong"}
          </DialogTitle>
          <DialogDescription>
            {complete.success ? complete.successMsg : complete.errorMsg}
          </DialogDescription>
          <Button onClick={handleSuccess}>Close</Button>
        </DialogContent>
      </Dialog>
      <div className="flex flex-row" onClick={() => setActive(!active)}>
        <h1>Add User </h1>
        {active ? <ChevronUp /> : <ChevronDown />}
        {!props.admin && active && (
          <span className="ml-2 text-red-500">
            You must be and admin to add a user
          </span>
        )}
      </div>
      {active && (
        <div className="mt-2">
          <div>
            Email:
            <input
              value={newUserEmail}
              type="email"
              onChange={(e) => setNewUserEmail(e.target.value)}
              className={`inline-block min-w-min ml-3 px-1 border border-gray-500 rounded-md ${
                !props.admin && "pointer-events-none opacity-50"
              }`}
              disabled={!props.admin}
            ></input>
          </div>
          <div className="flex flex-row items-center mt-2 mb-2">
            Select:
            <Select
              onValueChange={(value) => handleSelect(value)}
              disabled={!props.admin}
            >
              <SelectTrigger className="w-[180px] ml-3 border border-gray-500 rounded-md">
                <SelectValue placeholder="Priveledge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button disabled={!props.admin} onClick={handleSubmit}>
            Submit
          </Button>
          {fieldError && <div>Please fill all fields before submitting</div>}
        </div>
      )}
    </div>
  );
};
