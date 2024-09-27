const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./serviceB.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const serviceBProto = grpc.loadPackageDefinition(packageDefinition).serviceB;

const tasks = [];
let taskIdCounter = 1;

const server = new grpc.Server();

// Implement the gRPC service methods
server.addService(serviceBProto.BService.service, {
  PerformTask: (call, callback) => {
    const task = {
      id: taskIdCounter++,
      description: call.request.description,
      completed: false,
    };
    tasks.push(task);
    callback(null, task); // Return the created task to the client
  },
});

server.bindAsync(
  "localhost:50052",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Service B running at localhost:50052");
    server.start();
  }
);
