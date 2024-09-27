const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH_A = "./serviceA.proto"; // Proto for Service A
const PROTO_PATH_B = "../serviceB/serviceB.proto"; // Proto for Service B

// Load the proto definitions
const packageDefinitionA = protoLoader.loadSync(PROTO_PATH_A, {});
const packageDefinitionB = protoLoader.loadSync(PROTO_PATH_B, {});

// Define gRPC services
const serviceAProto = grpc.loadPackageDefinition(packageDefinitionA).serviceA;
const serviceBProto = grpc.loadPackageDefinition(packageDefinitionB).serviceB;

// Create a client for Service B
const serviceBClient = new serviceBProto.BService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

// Define Service A's gRPC server
const server = new grpc.Server();

// Implement Service A's gRPC service method
server.addService(serviceAProto.AService.service, {
  CallBService: (call, callback) => {
    // Service A is acting as a client of Service B here
    serviceBClient.PerformTask(
      { description: "Task from Service A" },
      (err, response) => {
        if (err) {
          callback(err, null);
        } else {
          // Return a response from Service B
          callback(null, {
            message: `Received from B: ${response.description} (ID: ${response.id})`,
          });
        }
      }
    );
  },
});

// Start Service A's gRPC server
server.bindAsync(
  "localhost:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Service A running at localhost:50051");
    server.start();
  }
);
