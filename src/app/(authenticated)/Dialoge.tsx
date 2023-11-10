import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  dialog,
} from "@material-tailwind/react";
 
export function DialogCustomAnimation({ open, handleOpen }: { open: boolean, handleOpen: () => void }) {
  return (

      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Hostname: Bobby Shmurda</DialogHeader>
        <DialogBody divider>
          Ports open: 23
          <br />
          OS: Windows 11
          <br />
          IP: 192.168.13.37
          <br />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
  );
}