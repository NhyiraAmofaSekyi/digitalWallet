import React from "react";

interface BalanceCardProps {
  currentBalance: number; // Current balance of the user
  percentageChange: number; // Percentage change (can be positive or negative)
  currency: string; // Currency symbol (e.g., "$", "€")
  walletId: string | null; // Unique wallet ID
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  currentBalance,
  percentageChange,
  currency,
  walletId,
}) => {
  // Determine if the percentage change is positive or negative
  const isPositive = percentageChange >= 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Current Balance */}
      <div className="text-3xl font-bold">
        {currency}
        {currentBalance.toLocaleString()}
      </div>

      {/* Wallet ID*/}
      <div className="flex items-center gap-2 mt-2">
      <span className="text-sm text-neutral-500">wallet Id : {walletId}</span>
      </div>

      {/* Percentage Change */}
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`text-sm font-semibold ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(percentageChange).toFixed(2)}%
        </span>
        <span className="text-sm text-neutral-500">from last month</span>
      </div>

      {/* Currency */}
      <div className="mt-4 text-sm text-neutral-500">
        Currency: <span className="font-semibold">{currency}</span>
      </div>
    </div>
  );
};

export default BalanceCard;