import React, { useState } from "react";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";
import Button from "./button";
import Dialog from "./dialog";
import Input from "./input";
import { Transaction, User, Wallet } from "../../types";
// import { createTransaction } from "../lib/transtaction";

interface WalletActionsProps {
  user: User | null;
  wallet: Wallet | null;
  createTransaction : (userId: number, transaction: Transaction)=> Promise<{ success: boolean; message: string }>;
}

const WalletActions: React.FC<WalletActionsProps> = ({ user, wallet, createTransaction })  => {

  const [amount, setAmount] = useState("");
  const [transferWallet, setTransferWallet] = useState(""); 
  const [isDialogOpen, setIsDialogOpen] = useState<"deposit" | "transfer" | "withdrawal" | null>(null);

  const handleTransaction = async () => {
    if (!user || !wallet) {
      alert("User or wallet not found. Please log in.");
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) {
      alert("Invalid amount. Please enter a valid number.");
      return;
    }

    const transactionData: Transaction = {
      type: isDialogOpen as "deposit" | "transfer" | "withdrawal", 
      amount: parseFloat(amount),
      senderWalletId: isDialogOpen === "withdrawal" || isDialogOpen === "transfer" ? wallet?.id : null,
      receiverWalletId: isDialogOpen === "deposit" ? wallet?.id : transferWallet || null,
      receiverUsername: isDialogOpen === "transfer" ? transferWallet : null, // Username or Wallet ID
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const result = await createTransaction(user.id,  transactionData);
    alert(result.message); // ✅ Show success or failure message

    // Reset fields after transaction
    setAmount("");
    setTransferWallet("");
    setIsDialogOpen(null);
  };

  return (
    <div>
      {/* Action Buttons */}
      <div className="grid md:grid-cols-3 md:grid-row-0 grid-cols-2 gap-4 md:mb-8 w-full">
        {/* Deposit Button */}
        <Button className="w-full" leftIcon={FaArrowDown} onClick={() => setIsDialogOpen("deposit")}>
          Deposit
        </Button>

        {/* Transfer Button */}
        <Button className="w-full" leftIcon={FaArrowUp} onClick={() => setIsDialogOpen("transfer")}>
          Transfer
        </Button>

        {/* Withdraw Button */}
        <Button
          className="md:col-span-1 col-span-2 w-full"
          leftIcon={FaWallet}
          onClick={() => setIsDialogOpen("withdrawal")}
        >
          Withdraw
        </Button>
      </div>

      {/* ✅ Transaction Dialogs (Deposit, Transfer, Withdrawal) */}
      <Dialog
        isOpen={isDialogOpen !== null}
        onClose={() => setIsDialogOpen(null)}
        title={`${isDialogOpen ? isDialogOpen.charAt(0).toUpperCase() + isDialogOpen.slice(1) : ""} Funds`}
        actionButtonText={isDialogOpen ? isDialogOpen.charAt(0).toUpperCase() + isDialogOpen.slice(1) : "Submit"}
        onAction={handleTransaction}
      >
        <div className="space-y-4">
          {/* Receiver Wallet for Transfers */}
          {isDialogOpen === "transfer" && (
            <div>
              <label htmlFor="transferWallet" className="block text-sm font-medium text-neutral-700 mb-1">
                Receiver Username / Wallet Address
              </label>
              <Input
                id="transferWallet"
                placeholder="Enter wallet address or username"
                value={transferWallet}
                onChange={(e) => setTransferWallet(e.target.value)}
              />
            </div>
          )}

          {/* Amount Input (Shared) */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-1">
              Amount
            </label>
            <Input
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default WalletActions;