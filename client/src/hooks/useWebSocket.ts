import { useEffect } from "react";
import { closeWebSocket, connectWebSocket } from "../services/webSocket/websocketService";
import { TransactionProps } from "../components/transaction";

export const useWebSocket = (
  walletId: string | null,
  updateBalance: (balance: number) => void,
  addTransaction: (transaction?: TransactionProps) => void
) => {
  useEffect(() => {
    if (walletId) {
      console.log("🔌 Connecting WebSocket for wallet:", walletId);
      connectWebSocket(walletId, updateBalance, addTransaction);
    }

    return () => {
      console.log("🔌 Cleaning up WebSocket connection...");
      closeWebSocket();
    };
  }, [walletId, updateBalance, addTransaction]); 

  return {}; 
};
