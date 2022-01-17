const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const fs = require("fs");

const protoObject = protoLoader.loadSync(
  path.resolve(__dirname, "./actuators.proto")
);
const actuatorsProto = grpc.loadPackageDefinition(protoObject);

const AC = {
  active: false,
  temperature: 29.0,
};

const server = new grpc.Server();

server.addService(actuatorsProto.ActuatorService.service, {
  controlAC: (request, callback) => {
    try {
      AC.active = request.request.active;
      AC.temperature = request.request.temperature;

      let content = JSON.parse(fs.readFileSync("../ambient.json", "utf8"));
      content.temperature = request.request.temperature;
      fs.writeFileSync("../ambient.json", JSON.stringify(content));
    } catch (e) {
      callback(null, { success: false, error_message: e });
    }

    const response = {
      success: true,
      error_message: "",
    };

    console.log(
      "Temperatura ajustada para " + AC.temperature + " graus Celsius"
    );

    callback(null, response);
  },
});
server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:50051");
server.start();
