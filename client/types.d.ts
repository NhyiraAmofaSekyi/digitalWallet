
export interface User {
    id: number;
    username: string;
    passwordHash: string;
    createdAt: string;
    updatedAt: string;
  }
  
export interface Wallet {
    id: string;
    userId: number;
    balance: number;
    createdAt: string;
    updatedAt: string;
  }
  
export  interface Transaction {
    id?: string;
    type: "transfer" | "deposit" | "withdrawal";
    amount: number;
    senderWalletId?: string | null ;
    senderWallet?: Wallet;
    receiverWalletId?: string | null;
    receiverWallet?: Wallet;
    status: "pending" | "completed" | "failed";
    receiverUsername?: string | null;
    senderUsername?: string | null ;
    createdAt: string;
  }

  