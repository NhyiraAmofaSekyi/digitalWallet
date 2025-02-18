
---

## **1. Running the Entire Application in Docker** 

If you want to **containerize** the entire app (API + Database + Client), navigate to the **root directory** and run:

```sh
docker compose --env-file .example.env up --build
```

### ** What This Does:**
- Builds the **PostgreSQL database** container.
- Builds and starts the **API** in a container.
- Builds and starts the **React Client** in a container.

---

## **3. Environment Variables** 

Before running the application, ensure you configure your **`.env`** file. You can use the provided example:

```sh
cp .example.env .env
```

Then, update `.env` with your values before running the app.

---

## **4. Accessing the App** 

- **Frontend (React App):** `http://localhost:5173`
- **API (ASP.NET 9 Backend):** `http://localhost:8080`
- **Database (PostgreSQL):** Runs in Docker on port **5432**

---

## **5. Stopping the Application** ⏹

- **For Docker:**  
  ```sh
  docker compose down
  ```
- **For Local Development:**  
  Stop the running **API** and **Client** by pressing `Ctrl + C`.

-


# **Digital Wallet - Setup & Running Guide** 

## **2. Running the Application Locally (Development Mode)** 

### **📌 Prerequisites**
- **Node.js** (for the client)  
- **Yarn** (preferred package manager)  
- **.NET 9** (for the API)  
- **Docker** (for the database)

### **📍 Step 1: Start the Database** 🗄️
Navigate to the `database` directory and run:

```sh
docker compose up -d
```
This will start PostgreSQL in a Docker container.

---

### **📍 Step 2: Start the API** ⚡
Navigate to the **Digital Wallet API** directory:

```sh
cd DigitalWallet
```

Run the API in **development mode**:

```sh
dotnet run
```

If you're using **.NET Aspire**, use:

```sh
dotnet wallet run dev
```

---

### **📍 Step 3: Start the Client (React + Vite)** 
Navigate to the **Client directory**:

```sh
cd client
```

Run the frontend in **development mode**:

```sh
yarn run dev
```

This will start the client at `http://localhost:5173`.

---
