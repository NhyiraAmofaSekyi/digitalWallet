import React, { useState } from "react";
import Button from "./button";
import Input from "./input";
import { Transaction, User, Wallet } from "../../types";
import { createTransaction } from "../lib/transtaction";

interface QuickTransferProps {
  user: User | null;
  wallet: Wallet | null;
}

const QuickTransfer: React.FC<QuickTransferProps> = ({ user, wallet }) => {
  // State for form inputs
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle Transfer Submission
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !wallet) {
      alert("User or wallet not found. Please log in.");
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) {
      alert("Invalid amount. Please enter a valid number.");
      return;
    }

    // Convert amount to number and validate
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (!recipient.trim()) {
      alert("Please enter a recipient wallet ID or username.");
      return;
    }

    setIsLoading(true);

    // Construct transaction object
    const transactionData: Transaction = {
      type: "transfer",
      amount: parsedAmount,
      senderWalletId: wallet.id, // Sender's wallet ID
      receiverWalletId: recipient, // Can be a wallet ID
      receiverUsername: recipient, // Can be a username
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Call API to create transaction
    const response = await createTransaction(user.id, transactionData);

    if (response.success) {
      alert(`✅ Transfer successful! Sent $${amount} to ${recipient}.`);
      setRecipient("");
      setAmount("");
    } else {
      alert(`❌ Transfer failed: ${response.message}`);
    }

    setIsLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Quick Transfer</h2>
      <form onSubmit={handleTransfer}>
        {/* Recipient Input */}
        <div className="mb-4">
          <label htmlFor="recipient" className="block text-sm font-medium text-neutral-700 mb-1">
            Recipient (Wallet ID or Username)
          </label>
          <Input
            id="recipient"
            type="text"
            placeholder="Enter wallet ID or username"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-1">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Processing..." : "Send Money"}
        </Button>
      </form>
    </div>
  );
};

export default QuickTransfer;
