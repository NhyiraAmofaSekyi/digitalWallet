### register 

```json 
{
  "id": 0,
  "username": "nhyira",
  "passwordHash": "password",
  "createdAt": "2025-02-12T17:38:55.036Z",
  "updatedAt": "2025-02-12T17:38:55.036Z"
}
```

curl 
``` bash
curl -X 'POST' \
  'http://localhost:5249/api/users/register' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": 0,
  "username": "nhyira",
  "passwordHash": "password",
  "createdAt": "2025-02-12T17:38:55.036Z",
  "updatedAt": "2025-02-12T17:38:55.036Z"
}'
```

### login 

```json 
{
  "username": "nhyira",
  "passwordHash": "password"
}
```

curl 
``` bash
curl -X 'POST'  'http://digital_wallet_api:8080/api/users/register' -H 'accept: */*' 
```

### create deposit 

```json 
{
  "type": "deposit",
  "amount": 140.05,
  "receiverWalletId": "87cc3022-d8fc-4dd2-b919-456955733ee1",
  "status": "pending",
  "createdAt": "2025-02-12T16:56:14.435Z"
}
```

curl 
``` bash
curl -X 'POST' \
  'http://localhost:5249/api/transactions/create' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "type": "deposit",
  "amount": 20,
  "receiverWalletId": "436db03a-2062-415d-96ef-e79c85d7a32a",
  "status": "pending",
  "createdAt": "2025-02-12T16:56:14.435Z"
}'
```


### create withdrawal 

```json 
{
  "type": "withdrawal",
  "amount": 100,
  "senderWalletId": "436db03a-2062-415d-96ef-e79c85d7a32a",
  "status": "pending",
  "createdAt": "2025-02-12T16:56:14.435Z"
}
```

curl 
``` bash
curl -X 'POST' \
  'http://localhost:5249/api/transactions/create' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "type": "withdrawal",
  "amount": 20,
  "senderWalletId": "436db03a-2062-415d-96ef-e79c85d7a32a",
  "status": "pending",
  "createdAt": "2025-02-12T16:56:14.435Z"
}'
```

### create transfer

```json 
{
  "type": "transfer",
  "amount": 20,
  "senderWalletId": "436db03a-2062-415d-96ef-e79c85d7a32a",
  "receiverWalletId": "87cc3022-d8fc-4dd2-b919-456955733ee1",
  "status": "pending",
  "createdAt": "2025-02-12T18:03:40.734Z"
}


{
  "type": "transfer",
  "amount": 100,
  "senderWalletId": "87cc3022-d8fc-4dd2-b919-456955733ee1",
   "receiverWalletId":"436db03a-2062-415d-96ef-e79c85d7a32a"
  "status": "pending",
  "createdAt": "2025-02-12T18:03:40.734Z"
}
```

curl 
``` bash
curl -X 'POST' \
  'http://localhost:5249/api/transactions/create' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "type": "transfer",
  "amount": 20,
  "senderWalletId": "436db03a-2062-415d-96ef-e79c85d7a32a",
  "receiverWalletId": "87cc3022-d8fc-4dd2-b919-456955733ee1",
  "status": "pending",
  "createdAt": "2025-02-12T18:03:40.734Z"
}'
```

``js
{
      type: "transfer",
      amount: 80,
      createdAt: "2025-02-14T22:29:15.125955Z",
      status: "completed",
      senderWalletId: "436db03a-2062-415d-96ef-e79c85d7a32a",
      receiverWalletId: "87cc3022-d8fc-4dd2-b919-456955733ee1",
      senderUsername: "testuser",
      receiverUsername: "nhyira",
      user,
      wallet
    },
    {
      type: "deposit",
      amount: 100,
      createdAt: "2025-02-15T17:05:10.763309Z",
      status: "completed",
      senderWalletId: null,
      receiverWalletId: "87cc3022-d8fc-4dd2-b919-456955733ee1",
      senderUsername: null,
      receiverUsername: "nhyira",
      user,
      wallet
    },
    {
      type: "withdrawal",
      amount: 100,
      createdAt: "2025-02-15T17:07:32.157749Z",
      status: "completed",
      senderWalletId: "87cc3022-d8fc-4dd2-b919-456955733ee1",
      receiverWalletId: null,
      senderUsername: "nhyira",
      receiverUsername: null,
      user,
      wallet
    },
    {
      type: "transfer",
      amount: 100,
      createdAt: "2025-02-15T17:09:57.540717Z",
      status: "completed",
      senderWalletId: "87cc3022-d8fc-4dd2-b919-456955733ee1",
      receiverWalletId: "436db03a-2062-415d-96ef-e79c85d7a32a",
      senderUsername: "nhyira",
      receiverUsername: "testuser",
      user,
      wallet
    }```