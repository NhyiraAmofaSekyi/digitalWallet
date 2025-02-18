**Database Documentation: PostgreSQL Implementation**

### 1. ENUM Types

```sql
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE transaction_type AS ENUM ('transfer', 'deposit', 'withdrawal');
```
- **Purpose**: Encapsulates the valid statuses (`pending`, `completed`, `failed`) and transaction types (`transfer`, `deposit`, `withdrawal`).
- **Benefit**: Ensures the database only accepts defined values, improving data consistency and clarity.

---

### 2. Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```
**Key Fields and Constraints**:
- **id**: `SERIAL PRIMARY KEY`, an auto-incremented integer serving as the primary key.
- **username**: Uniquely identifies each user; limited to 50 characters.
- **password_hash**: Stores a hashed password, enhancing security over plaintext.
- **created_at** and **updated_at**: Timestamps automatically set to the current time.

**Design Considerations**:
- The `username` field is made `UNIQUE`, preventing duplicates.
- The `password_hash` is `TEXT` since hash lengths vary based on the hashing algorithm used.
- Timestamps default to `NOW()`, ensuring automatic auditing of creation and update times.

---

### 3. Wallets Table

```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```
**Key Fields and Constraints**:
- **id**: `UUID PRIMARY KEY`, automatically generated via `uuid_generate_v4()`.
- **user_id**: References the **users** table, ensuring each wallet is tied to exactly one user.
- **balance**: A decimal value with two decimal places. The `CHECK (balance >= 0)` constraint prevents negative balances.
- **created_at** and **updated_at**: Store creation and update timestamps for audit purposes.

**Design Considerations**:
- The `user_id` has a `UNIQUE` constraint, implying a one-to-one relationship between **users** and **wallets**  for this simple implementation but allows for scaling as one user could have multiple wallets once the constraint is removed.
- `ON DELETE CASCADE` ensures that if a user record is removed, the associated wallet is also removed.
- Using a `UUID` for `id` can help avoid collisions and simplifies replication across distributed systems.

---

### 4. Transactions Table

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type transaction_type NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    sender_wallet_id UUID REFERENCES wallets(id) ON DELETE RESTRICT, 
    receiver_wallet_id UUID REFERENCES wallets(id) ON DELETE RESTRICT,
    status transaction_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),

    CHECK (
        (type = 'transfer' AND sender_wallet_id IS NOT NULL AND receiver_wallet_id IS NOT NULL) OR
        (type = 'deposit' AND receiver_wallet_id IS NOT NULL) OR
        (type = 'withdrawal' AND sender_wallet_id IS NOT NULL)
    )
);
```
**Key Fields and Constraints**:
- **id**: A `UUID` serving as the primary key; automatically generated via `uuid_generate_v4()`.
- **type**: Must be one of `transfer`, `deposit`, or `withdrawal`.
- **amount**: A positive decimal value (`CHECK (amount > 0)`).
- **sender_wallet_id** and **receiver_wallet_id**:
  - Reference the **wallets** table, ensuring valid foreign keys.
  - `ON DELETE RESTRICT` prevents accidental removal of a wallet that is still referenced by transactions.
- **status**: Must be `pending`, `completed`, or `failed`, with a default of `pending`.
- **created_at**: Automatically set upon creation.

**Design Considerations**:
1. The **`CHECK` constraint** ensures valid transaction logic:
   - **transfer**: Requires both `sender_wallet_id` and `receiver_wallet_id`.
   - **deposit**: Requires a non-null `receiver_wallet_id`.
   - **withdrawal**: Requires a non-null `sender_wallet_id`.
2. **status** defaults to `pending`, a typical workflow scenario where transactions may later be updated to `completed` or `failed`.
3. Using **UUID** for transactions supports global uniqueness across distributed environments.

---

## Additional Notes

1. **Data Consistency**:
   - Balances cannot go negative due to `CHECK (balance >= 0)` in **wallets**.
   - Each transaction’s `amount` must be positive (`CHECK (amount > 0)`).
   - The transaction constraint ensures a deposit, withdrawal, or transfer is properly formed.

2. **Handling Concurrency**:
   - PostgreSQL locks and the `serializable` isolation level (or explicit row locking) can be used to handle concurrent updates.


**Conclusion:**
This PostgreSQL schema enforces strict **data consistency** (no negative balances, valid transaction logic) and leverages **UUID** primary keys for scalability. The structured approach, use of `CHECK` constraints, and enumerated types (`transaction_status`, `transaction_type`) ensure the database logic is clean and reliable.k