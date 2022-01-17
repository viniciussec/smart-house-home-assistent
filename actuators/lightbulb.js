const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const protoObject = protoLoader.loadSync(
  path.resolve(__dirname, "./actuators.proto")
);
const actuatorsProto = grpc.loadPackageDefinition(protoObject);

const LightBulb = {
  active: false,
};

const server = new grpc.Server();

server.addService(actuatorsProto.ActuatorService.service, {
  controlLightBulb: (request, callback) => {
    try {
      LightBulb.active = request.request.active;
    } catch (e) {
      callback(null, { success: false, error_message: e });
    }

    const response = {
      success: true,
      error_message: "",
    };

    console.log("Lâmpada " + (LightBulb.active ? "ligada" : "desligada"));

    callback(null, response);
  },
});
server.bind("127.0.0.1:50052", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:50052");
server.start();
