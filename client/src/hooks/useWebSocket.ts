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

      connectWebSocket(walletId, updateBalance, addTransaction);
    }

    return () => {

      closeWebSocket();
    };
  }, [walletId]); 

  return {}; 
};
