# gRPC-MultiService-Communication


This project demonstrates how to set up and implement inter-service communication using gRPC in a Node.js application. It consists of three parts:

1. **Service A**: Acts as a client of `Service B`.
2. **Service B**: Provides the actual functionality that `Service A` uses.
3. **Client**: Interacts with `Service A` via gRPC.

## Project Structure

```
.
├── README.md
├── client.js              # Client to interact with Service A
├── serviceA
│   ├── serviceA.js        # Server and client for Service A
│   └── serviceA.proto     # Protobuf file for Service A
├── serviceB
│   ├── serviceB.js        # Server for Service B
│   └── serviceB.proto     # Protobuf file for Service B
└── package.json           # Project dependencies and scripts
```

### Protobuf Definitions

- **`serviceA.proto`**: Defines the `CallBService` method that Service A provides.
- **`serviceB.proto`**: Defines the `PerformTask` method that Service B provides.

## Prerequisites

- [Node.js](https://nodejs.org/) (v12 or higher)
- `@grpc/grpc-js` and `@grpc/proto-loader` packages installed

Install the required dependencies by running:

```bash
npm install
```

## Running the Services and Client

### Step 1: Start Service B

1. Navigate to the `serviceB` directory:

    ```bash
    cd serviceB
    ```

2. Run `serviceB.js`:

    ```bash
    node serviceB.js
    ```

Service B will start running on `localhost:50052`.

### Step 2: Start Service A

1. Navigate to the `serviceA` directory:

    ```bash
    cd ../serviceA
    ```

2. Run `serviceA.js`:

    ```bash
    node serviceA.js
    ```

Service A will start running on `localhost:50051`.

### Step 3: Start the Client

1. Navigate back to the root directory:

    ```bash
    cd ..
    ```

2. Run `client.js`:

    ```bash
    node client.js
    ```

The client will connect to `Service A` and trigger a series of interactions as described below.

## Client Overview

The `client.js` file connects to `Service A` and performs the following operations:

1. **Call `CallBService` on Service A**: Sends a request to `Service A`.
2. **Service A calls `PerformTask` on Service B**: The task is created in Service B and a response is sent back to Service A.
3. **Service A responds to the client**: The client receives a message from Service A that includes details from Service B.

### Expected Output

When running `client.js`, you should see the following sequence of events in your console:

**Client Output:**

```
Task added: Received from B: Task from Service A (ID: 1)
```

**Service A Output:**

```
Service A running at localhost:50051
Received from B: Task from Service A (ID: 1)
```

**Service B Output:**

```
Service B running at localhost:50052
```

### client.js

Here’s the content for `client.js`:

```js
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH_A = "./serviceA/serviceA.proto";

// Load the protobuf file for Service A
const packageDefinitionA = protoLoader.loadSync(PROTO_PATH_A, {});
const serviceAProto = grpc.loadPackageDefinition(packageDefinitionA).serviceA;

// Create a gRPC client to connect to Service A
const serviceAClient = new serviceAProto.AService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Call Service A's `CallBService` method
serviceAClient.CallBService({}, (err, response) => {
  if (err) {
    console.error("Error calling Service A:", err);
  } else {
    console.log("Task added:", response.message);
  }
});
```

## Protobuf Definitions

### serviceA.proto

```proto
syntax = "proto3";

package serviceA;

service AService {
  rpc CallBService (Empty) returns (AServiceResponse);
}

message Empty {}

message AServiceResponse {
  string message = 1;
}
```

### serviceB.proto

```proto
syntax = "proto3";

package serviceB;

service BService {
  rpc PerformTask (TaskRequest) returns (TaskResponse);
}

message TaskRequest {
  string description = 1;
}

message TaskResponse {
  int32 id = 1;
  string description = 2;
  bool completed = 3;
}
```

## Notes

1. **Running Order**: Always start `Service B` first before starting `Service A` since `Service A` depends on `Service B`.
2. **Client Interaction**: The client connects to Service A, which then interacts with Service B, demonstrating how one gRPC service can act as both a server and a client in a microservices architecture.
3. **Port Configuration**: If there are port conflicts, update the ports in `serviceA.js`, `serviceB.js`, and `client.js` accordingly.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---