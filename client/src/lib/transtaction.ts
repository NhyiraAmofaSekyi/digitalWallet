import { Transaction } from "../../types";
export const createTransaction = async (userId: number, transaction: Transaction): Promise<{ success: boolean; message: string }> => {
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


    // Send POST request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify(requestBody),
    });



    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Transaction Failed:", JSON.stringify(data.message));
      return { success: false, message: data.message || "Failed to create transaction" };
    }

    return { success: true, message: data.message || "Transaction created successfully" };
  } catch (error) {
    console.error("❌ Transaction Failed:", error);
    return { success: false, message: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
};

const isValidUUID = (id: string | undefined | null): boolean => {
  return !!id && /^[0-9a-fA-F-]{36}$/.test(id);
};

