import React, { useEffect, useState } from "react";
import BalanceCard from "./components/balance";
import QuickTransfer from "./components/quickTransfer";
import TransactionComponent, { TransactionProps } from "./components/transaction";
import Navbar from "./components/navBar";
import WalletActions from "./components/WalletActions";
import { useUserWallet } from "./hooks/useUserWallet";
import { useTransactions } from "./hooks/useTransactions";
import { Transaction } from "../types";

const WalletDashboard: React.FC = () => {

  const { user, wallet, balance, logout, updateBalance } = useUserWallet();
  const { } = useTransactions(user);
  const [transactions, setTransactions] = useState<TransactionProps[]>(() => JSON.parse(localStorage.getItem("transactions") || "[]"));

  const createTransaction = async (userId: number, transaction: Transaction): Promise<{ success: boolean; message: string }> => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/transactions/${userId}`;

      if (!userId || typeof userId !== "number" || userId <= 0) {
        return { success: false, message: "Invalid user ID" };
      }


      if (!["transfer", "deposit", "withdrawal"].includes(transaction.type)) {
        return { success: false, message: "Invalid transaction type" };
      }

      if (typeof transaction.amount !== "number" || isNaN(transaction.amount) || transaction.amount <= 0) {
        return { success: false, message: "Invalid transaction amount. It must be a positive number." };
      }


      let requestBody: Partial<Transaction> = {
        type: transaction.type,
        amount: transaction.amount,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      if (transaction.type === "deposit") {
        if (!transaction.receiverWalletId) {
          return { success: false, message: "Receiver wallet ID is required for deposits" };
        }
        requestBody.receiverWalletId = transaction.receiverWalletId;
      }
      else if (transaction.type === "withdrawal") {
        if (!transaction.senderWalletId) {
          return { success: false, message: "Sender wallet ID is required for withdrawals" };
        }
        requestBody.senderWalletId = transaction.senderWalletId;
      }
      else if (transaction.type === "transfer") {
        if (!transaction.receiverUsername && !transaction.receiverWalletId) {
          return { success: false, message: "Receiver username or wallet ID is required for transfers" };
        }

        requestBody.senderWalletId = transaction.senderWalletId;
        requestBody.receiverWalletId = isValidUUID(transaction.receiverWalletId) ? transaction.receiverWalletId : null;
        requestBody.receiverUsername = !isValidUUID(transaction.receiverWalletId) ? transaction.receiverUsername : null;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      const newtransaction: TransactionProps = data.transactionDto
      const newBalance: number | null = data.balance ?? null;


      if (newtransaction) {
        const updated = [newtransaction, ...transactions];
        localStorage.setItem("transactions", JSON.stringify(updated));

        setTransactions(updated);
      } else {
        console.warn("⚠️ No transaction received from response.");
      }


      if (newBalance !== null) {
        updateBalance(newBalance);
      } else {
        console.warn("⚠️ No balance update received from response.");
      }
      
      if (!response.ok) {

        return { success: false, message: data.message || "Failed to create transaction" };
      }

      return { success: true, message: data.message || "Transaction created successfully" };
    } catch (error) {

      return { success: false, message: error instanceof Error ? error.message : "An unexpected error occurred" };
    }
  };

  const isValidUUID = (id: string | undefined | null): boolean => {
    return !!id && /^[0-9a-fA-F-]{36}$/.test(id);
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions/${user.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch transactions");

      const data = await response.json();
      setTransactions(data);
      localStorage.setItem("transactions", JSON.stringify(data))
      return data
        ;
    } catch (error) {
      console.error("Fetch Transactions Failed:", error);
    }
  };

  const [percentageChange] = useState(5.25);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, [user]); 

  if (!isLoaded) return null;


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
                <BalanceCard currentBalance={balance} percentageChange={percentageChange} currency="$" walletId={wallet ? wallet.id : ""} />
              </div>

              <WalletActions user={user} wallet={wallet} createTransaction={createTransaction} />
            </div>

            {/* Quick Transfer Section */}
            <div className="mb-8 hidden md:block">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Transfer</h2>
              <QuickTransfer user={user} wallet={wallet} createTransaction={createTransaction} />
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