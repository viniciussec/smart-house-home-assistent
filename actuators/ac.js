const grpc = require("grpc");
const protoLoader = require('@grpc/proto-loader')
const path = require('path');

const protoObject = protoLoader.loadSync(path.resolve(__dirname, './actuators.proto'));
const actuatorsProto = grpc.loadPackageDefinition(protoObject);

const AC = {
  active: false,
  temperature: 29.0,
};

const server = new grpc.Server();

server.addService(actuatorsProto.ActuatorService.service, {
  controlAC: (request, callback) => {
    try {
      AC.active = true;
      AC.temperature = request.temperature;
    } catch (e) {
      callback(null, { success: false, error_message: e });
    }

    const response = {
      success: true,
      error_message: "",
    };

    callback(null, response);
  },
});
server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:50051");
server.start();
