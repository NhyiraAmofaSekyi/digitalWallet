import { useState } from "react";
import { User, Wallet } from "../../types";
import { useWebSocket } from "./useWebSocket";
import { useTransactions } from "./useTransactions";
import { closeWebSocket } from "../services/webSocket/websocketService";
import { useNavigate } from "react-router-dom";


export const useUserWallet = () => {
  const navigate = useNavigate(); 
  const [user, setUser] = useState<User | null>(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [wallet, setWallet] = useState<Wallet | null>(() => JSON.parse(localStorage.getItem("wallet") || "null"));
  const [balance, setBalance] = useState<number>(() => JSON.parse(localStorage.getItem("balance") || "0"));
  const { transactions, addTransaction, clearTransactions } = useTransactions(user);

  
  
  const setUserWallet = (newUser: User, newWallet: Wallet) => {
    setUser(newUser);
    setWallet(newWallet);
    setBalance(newWallet.balance);


    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("wallet", JSON.stringify(newWallet));
    localStorage.setItem("balance", JSON.stringify(newWallet.balance));
  };

  const logout = async () => {
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) throw new Error(JSON.stringify(data.message));

      setUser(null);
      setWallet(null);
      setBalance(0);
      clearTransactions();
      closeWebSocket();

      localStorage.removeItem("user");
      localStorage.removeItem("wallet");
      localStorage.removeItem("balance");
      localStorage.removeItem("transactions");

      navigate('/signin', { replace: true });
    } catch (error) {
      console.error("Login Request Failed:", error);
    }

  };

  const login = async (username: string, passwordHash: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: username, passwordHash: passwordHash }),
      });

      const data = await response.json();

      if (!response.ok) {

        alert(`Login Request Failed: ${JSON.stringify(data.message)}`);
        return false

      }

      if (data.user && data.wallet) {
        setUserWallet(data.user, data.wallet);
      }
      alert(`Login Successful: ${JSON.stringify(data.message)}`);
      return true
    } catch (error) {
      console.error("Login Request Failed:", error);
      alert(`Error: ${(error as any)}`);
    }
  };

  const register = async (username: string, passwordHash: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: username, passwordHash: passwordHash }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Registration failed: ${JSON.stringify(data.message)}`);
        return false

      }

      if (data.user && data.wallet) {
        setUserWallet(data.user, data.wallet);

      }
      alert(`Login Successful: ${JSON.stringify(data.message)}`);
      return true
    } catch (error) {
      console.error("Login Request Failed:", error);
      alert(`Error: ${(error as any)}`);
      return false
    }
  };


  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
    localStorage.setItem("balance", JSON.stringify(newBalance));
  };

  useWebSocket(wallet?.id ?? null, updateBalance, addTransaction);



  return { user, wallet, balance, setUserWallet, logout, updateBalance, transactions, login, register };
};
