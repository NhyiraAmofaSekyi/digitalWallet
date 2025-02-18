

-- Enable the UUID extension (required for UUIDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define transaction status and type as ENUMs
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE transaction_type AS ENUM ('transfer', 'deposit', 'withdrawal');

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Wallets 
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type transaction_type NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    sender_wallet_id UUID REFERENCES wallets(id) ON DELETE RESTRICT, 
    receiver_wallet_id UUID REFERENCES wallets(id) ON DELETE RESTRICT,
    status transaction_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),

    -- Constraint to ensure correct transaction logic
    CHECK (
        (type = 'transfer' AND sender_wallet_id IS NOT NULL AND receiver_wallet_id IS NOT NULL) OR
        (type = 'deposit' AND receiver_wallet_id IS NOT NULL) OR
        (type = 'withdrawal' AND sender_wallet_id IS NOT NULL)
    )
);
