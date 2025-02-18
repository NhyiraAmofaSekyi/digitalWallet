### **Digital Wallet API Documentation**  

This API provides authentication, user management, transaction handling, and WebSocket connectivity for a digital wallet system. Below are the available endpoints, their descriptions, expected responses, and requirements.

---

## **Authentication & User Management**

### **Register a New User**
**Endpoint:**  
`POST /auth/register`

**Description:**  
Registers a new user and returns a JWT token in an HTTP-only cookie.

**Request Body:**  
```json
{
  "username": "string",
  "password": "string"
}
```

**Responses:**  
- `200 OK` – User registered successfully  
- `400 Bad Request` – Invalid request or username already exists  

---

### **User Login**
**Endpoint:**  
`POST /auth/login`

**Description:**  
Authenticates a user and returns a JWT token in an HTTP-only cookie.

**Request Body:**  
```json
{
  "username": "string",
  "password": "string"
}
```

**Responses:**  
- `200 OK` – User authenticated successfully  
- `401 Unauthorized` – Invalid credentials provided  

---

### **User Logout**
**Endpoint:**  
`POST /auth/logout`

**Description:**  
Logs out the user by clearing the authentication cookie.

**Responses:**  
- `200 OK` – User logged out successfully  

---

## **WebSocket Connection**

### **WebSocket Connection for Balance & Transaction Updates**
**Endpoint:**  
`GET /users/connect/{walletId}`

**Description:**  
Establishes a WebSocket connection for real-time transaction and balance updates.

**Path Parameter:**  
- `walletId` (UUID) – The wallet ID to establish a connection

**Response:**  
- `101 Switching Protocols` – WebSocket connection established  
- `404 Not Found` – Wallet ID does not exist  

---

## **Transactions Management**

### **Retrieve User Transactions**
**Endpoint:**  
`GET /transaction/{userId}`

**Description:**  
Retrieves all transactions associated with a specific user.

**Path Parameter:**  
- `userId` (integer) – The ID of the user whose transactions are to be retrieved  

**Responses:**  
- `200 OK` – Returns a list of transactions  
- `404 Not Found` – User or transactions not found  

---

### **Create a Transaction**
**Endpoint:**  
`POST /transaction/{userId}`

**Description:**  
Creates a new transaction (transfer, deposit, or withdrawal).

**Request Body:**  
```json
{
  "type": "transfer | deposit | withdrawal",
  "amount": 100.50,
  "senderWalletId": "UUID",
  "receiverWalletId": "UUID",
  "receiverUsername": "string",
  "status": "pending"
}
```

**Responses:**  
- `200 OK` – Transaction was successful  
- `400 Bad Request` – Invalid transaction details provided  
- `404 Not Found` – One or more wallets were not found  
- `500 Internal Server Error` – An unexpected server error occurred  

---

## **Security & Middleware Enforcement**
The API includes middleware to ensure that:
1. Only authenticated users can access wallet and transaction resources  
2. Only the owner of a wallet can perform actions on that wallet  
3. JWT authentication is required for all protected routes  

---

## **API Documentation**
When running the server locally, full API documentation is available at:  
[`http://localhost:5249/swagger/index.html`](http://localhost:5249/swagger/index.html)  

Let me know if you need any refinements.