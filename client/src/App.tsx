import React, { useState } from "react";
import BalanceCard from "./components/balance";
import QuickTransfer from "./components/quickTransfer";
import TransactionComponent from "./components/transaction";
import Navbar from "./components/navBar";
import WalletActions from "./components/WalletActions";
import { useUserWallet } from "./hooks/useUserWallet";

const WalletDashboard: React.FC = () => {
  const { user, wallet, balance, logout, transactions } = useUserWallet();
  // Filter transactions based on active filter
  const [percentageChange] = useState(5.25);


  return (
    <>
      <Navbar user={user} wallet={wallet} logout={logout} />
      <div className="pt-28 p-6  md:px-20  bg-neutral-50 min-h-screen ">
        {/* Header */}
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Left Section: Balance, Actions, and Quick Transfer */}
          <div className="w-full lg:w-1/2">
            {/* Balance Card and Action Buttons */}
            <div >
              <h1 className="text-3xl font-bold text-neutral-900 mb-6">Wallet Dashboard</h1>
              <div className="mb-4">
                <BalanceCard currentBalance={balance} percentageChange={percentageChange} currency="$" walletId={wallet? wallet.id : ""}/>
              </div>

              <WalletActions user={user} wallet={wallet} />
            </div>

            {/* Quick Transfer Section */}
            <div className="mb-8 hidden md:block">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Transfer</h2>
              <QuickTransfer user={user} wallet={wallet} />
            </div>
          </div>


          {/* Right Section: Filters and Transactions */}
          <div className="w-full lg:w-1/2">

            {/* Transactions List */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recent Transactions</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {transactions.map((transaction, index) => (
                  <TransactionComponent key={index} {...transaction} user={user} wallet={wallet} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletDashboard;