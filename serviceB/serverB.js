const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./serviceB.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const serviceBProto = grpc.loadPackageDefinition(packageDefinition).serviceB;

const tasks = [];
let taskIdCounter = 1;

// Create a gRPC server for Service B
const server = new grpc.Server();

// Define multiple internal functions for Service B
const internalServiceBFunctions = {
  ServiceBOnlyFunction1: (call, callback) => {
    console.log("ServiceBOnlyFunction1 was called");
    callback(null, { message: "This is an internal function of Service B" });
  },
  ServiceBOnlyFunction2: (call, callback) => {
    console.log("ServiceBOnlyFunction2 was called");
    callback(null, {
      message: "This is another internal function of Service B",
    });
  },
};

// Expose only `PerformTask` as a public gRPC method
server.addService(serviceBProto.BService.service, {
  PerformTask: (call, callback) => {
    const task = {
      id: taskIdCounter++,
      description: call.request.description,
      completed: false,
    };
    tasks.push(task);
    console.log("Task added to Service B:", task);
    callback(null, task);
  },

  // Optionally expose another function if needed
  ServiceBOnlyFunction1: internalServiceBFunctions.ServiceBOnlyFunction1,
});

// Start Service B's gRPC server
server.bindAsync(
  "localhost:50052",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Service B running at localhost:50052");
    server.start();
  }
);
