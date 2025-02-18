import { useState } from "react";
import { User } from "../../types";
import { TransactionProps } from "../components/transaction";

export const useTransactions = (user: User | null) => {
  const [transactions, setTransactions] = useState<TransactionProps[]>(() => JSON.parse(localStorage.getItem("transactions") || "[]"));

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
      localStorage.setItem("transactions", JSON.stringify(data));
    } catch (error) {
      console.error("Fetch Transactions Failed:", error);
    }
  };

  // useEffect(() => {
  //   if (user) fetchTransactions();
  // }, [user]);

  const addTransaction = (transaction?: TransactionProps) => {
    if (!transaction) return;
    setTransactions(() => {
      const updated = [transaction, ...transactions];
      localStorage.setItem("transactions", JSON.stringify(updated));
      return updated;
    });
  };

  const clearTransactions = () => {
    setTransactions([]);
    localStorage.removeItem("transactions");
  };

  return { transactions, fetchTransactions, addTransaction , clearTransactions, setTransactions};
};
