import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";

const PasswordResetModal = ({ isOpen, onClose, onReset, userId }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = () => {
    console.log(newPassword, confirmPassword);
    onReset(userId, newPassword);
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>
            Reset Password for{" "}
            <span className="text-red-700 font-bold">{userId}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {newPassword !== confirmPassword && (
          <span className="text-red-400">Passwords do not Match !!</span>
        )}
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <button
            onClick={handleReset}
            className="bg-red-600 text-white hover:bg-red-700 focus:hover:ring-red-500 px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
            disabled={newPassword !== confirmPassword ? "disabled" : ""}
          >
            Reset Password
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetModal;
