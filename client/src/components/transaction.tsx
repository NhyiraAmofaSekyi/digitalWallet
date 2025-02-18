import React from "react";
import { IconType } from "react-icons";
import { Transaction } from "../../types";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";


export interface TransactionProps extends Transaction {
  Icon?: IconType; // Icon for the transaction type
  isSender?: boolean; // Whether the transaction is outgoing
  user: { id: number; username: string } | null; // Current logged-in user
  wallet: { id: string; balance: number } | null; // Current wallet
}

const TransactionComponent: React.FC<TransactionProps> = ({
  type = "Transaction",
  amount = 0,
  status = "completed",
  createdAt,
  senderWalletId,
  senderUsername,
  receiverUsername,
  wallet,
}) => {

  const isSender = wallet?.id == senderWalletId;
  const currency = "$";

  // Status color mapping
  const statusColors = {
    completed: "text-green-600 bg-green-100",
    pending: "text-yellow-600 bg-yellow-100",
    failed: "text-red-600 bg-red-100",
  };  // Format date and time from createdAt
  const dateObj = new Date(createdAt);
  const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`; // YYYY-MM-DD
  const formattedTime = `${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}:${String(dateObj.getSeconds()).padStart(2, "0")}`; // HH:MM:SS

  const getTransactionIcon = (): IconType => {
    if (type === "withdrawal") return FaWallet;
    return isSender ? FaArrowUp : FaArrowDown;
  };
  const TransactionIcon = getTransactionIcon();

  return (
    <div className="flex justify-between items-center w-full px-6 py-4 hover:bg-neutral-50 transition-colors duration-200 cursor-pointer">
      {/* Left Section: Icon and Details */}
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="p-3 rounded-full bg-neutral-100">
          <TransactionIcon className="w-4 h-4 text-neutral-700" />
        </div>

        {/* Transaction Details */}
        <div>
          <h2 className="text-lg font-semibold">{type}</h2>
          <p className="text-sm text-neutral-500">
            {type === "transfer"
              ? isSender
                ? `To: ${receiverUsername ?? "Unknown"}`
                : `From: ${senderUsername ?? "Unknown"}`
              : type === "deposit"
                ? "To: Wallet"
                : "From: Wallet"}

          </p>
        </div>
      </div>

      {/* Right Section: Amount, Date, and Status */}
      <div className="text-right">
        {/* Amount */}
        <p className="text-lg font-semibold">
          {isSender ? "-" : "+"}
          {currency}
          {amount.toFixed(2)}
        </p>

        {/* Date and Time */}
        <p className="text-sm text-neutral-500">
          {formattedDate} · {formattedTime}
        </p>

        {/* Status */}
        <p
          className={`text-sm px-2 py-1 rounded-full inline-block ${statusColors[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </p>
      </div>
    </div>
  );
};

export default TransactionComponent;