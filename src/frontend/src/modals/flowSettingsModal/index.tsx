import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useContext, useRef, useState } from "react";
import { alertContext } from "../../contexts/alertContext";
import { PopUpContext } from "../../contexts/popUpContext";
import { TabsContext } from "../../contexts/tabsContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { SETTINGS_DIALOG_SUBTITLE } from "../../constants";
import { updateFlowInDatabase } from "../../controllers/API";

export default function FlowSettingsModal() {
  const [open, setOpen] = useState(true);
  const { closePopUp } = useContext(PopUpContext);
  const { setErrorData, setSuccessData } = useContext(alertContext);
  const ref = useRef();
  const { flows, tabId, updateFlow } = useContext(TabsContext);
  function setModalOpen(x: boolean) {
    setOpen(x);
    if (x === false) {
      setTimeout(() => {
        closePopUp();
      }, 300);
    }
  }

  function handleSaveFlow(flow) {
    try {
      updateFlowInDatabase(flow);
      // updateFlowStyleInDataBase(flow);
    } catch (err) {
      setErrorData(err);
    }
  }
  const [name, setName] = useState(flows.find((f) => f.id === tabId).name);
  const [description, setDescription] = useState(
    flows.find((f) => f.id === tabId).description
  );
  return (
    <Dialog open={true} onOpenChange={setModalOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="lg:max-w-[600px] h-[390px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="pr-2">Settings</span>
            <ArrowDownTrayIcon
              className="h-6 w-6 text-gray-800 pl-1 dark:text-white"
              aria-hidden="true"
            />
          </DialogTitle>
          <DialogDescription>{SETTINGS_DIALOG_SUBTITLE}</DialogDescription>
        </DialogHeader>

        <Label>
          <span className="font-medium">Name</span>

          <Input
            className="mt-2"
            onChange={(event) => {
              setName(event.target.value);
            }}
            type="text"
            name="name"
            value={name ?? null}
            placeholder="File name"
            id="name"
          />
        </Label>
        <Label>
          <span className="font-medium">Description (optional)</span>
          <Textarea
            name="description"
            id="description"
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            value={description ?? null}
            placeholder="Flow description"
            className="max-h-[100px] mt-2"
            rows={3}
          />
        </Label>

        <DialogFooter>
          <Button
            onClick={() => {
              handleSaveFlow(flows.find((f) => f.id === tabId));
              setSuccessData({ title: "Changes saved successfully" });
            }}
            type="submit"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
