const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const fs = require("fs");

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
      let content = JSON.parse(fs.readFileSync("../ambient.json", "utf8"));
      if(content.smoke === true && request.request.active) content.smoke = false;
      else content.smoke = request.request.active;

      Sprinkler.active = request.request.active;
      fs.writeFileSync("../ambient.json", JSON.stringify(content));

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
server.bind("127.0.0.1:50053", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:50053");
server.start();
