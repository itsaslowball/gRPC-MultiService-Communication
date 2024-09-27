const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH_A = "./serviceA/serviceA.proto"; // Proto for Service A

const packageDefinitionA = protoLoader.loadSync(PROTO_PATH_A, {});
const serviceAProto = grpc.loadPackageDefinition(packageDefinitionA).serviceA;


const serviceAClient = new serviceAProto.AService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

serviceAClient.CallBService({}, (err, response) => {
    if (err) {
        console.error(err);
    } else {
        console.log(response.message);
    }
});


