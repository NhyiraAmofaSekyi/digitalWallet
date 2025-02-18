import { TransactionProps } from "../../components/transaction";

export type WebSocketMessage = {
  walletId: string;
  balance: number;
  transaction: TransactionProps;
};

let socket: WebSocket | null = null;

export const connectWebSocket = (
  walletId: string,
  updateBalance: (balance: number) => void,
  addTransaction: (transaction?: TransactionProps) => void
): void => {
  if (!walletId) return;

  if (socket) {
    console.warn("🔌 WebSocket already connected. Closing existing connection first.");
    closeWebSocket(); 
  }

  socket = new WebSocket(`${import.meta.env.VITE_WS}/${walletId}`);

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const data: WebSocketMessage = JSON.parse(event.data);
      console.log("📡 WebSocket received:", data);

      if (data.balance !== undefined || null) {
        updateBalance(data.balance);
      }
      if (data.transaction) {
        addTransaction(data.transaction);
      }
    } catch (error) {
      console.error("❌ WebSocket message error:", error);
    }
  };

  socket.onclose = (event) => {
    console.log("🔌 WebSocket disconnected. Code:", event.code);
    socket = null;
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };
};

/** ✅ Close WebSocket */
export const closeWebSocket = () => {
  if (socket) {
    console.log("🔌 Closing WebSocket...");
    socket.close();
    socket = null; // ✅ Ensure global reference is cleared
  }
};

