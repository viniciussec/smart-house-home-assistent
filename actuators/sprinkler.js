const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const protoObject = protoLoader.loadSync(
  path.resolve(__dirname, "./actuators.proto")
);
const actuatorsProto = grpc.loadPackageDefinition(protoObject);

const Sprinkler = {
  active: false,
};

const server = new grpc.Server();

server.addService(actuatorsProto.ActuatorService.service, {
  controlSprinkler: (request, callback) => {
    try {
      Sprinkler.active = request.request.active;
    } catch (e) {
      callback(null, { success: false, error_message: e });
    }

    const response = {
      success: true,
      error_message: "",
    };

    console.log(
      "Sprinker " + (Sprinkler.active ? 'ligado' : 'desligado')
    );

    callback(null, response);
  },
});
server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:50051");
server.start();
