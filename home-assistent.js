#!/usr/bin/env node

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
let amqp = require("amqplib/callback_api");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

const protoObject = protoLoader.loadSync(
  path.resolve(__dirname, "./actuators/actuators.proto")
);
const actuatorsProto = grpc.loadPackageDefinition(protoObject);

const clientAC = new actuatorsProto.ActuatorService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const clientLightBulb = new actuatorsProto.ActuatorService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

const clientSprinkler = new actuatorsProto.ActuatorService(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

io.on("connection", (socket) => {
  console.log("New client connected");

  amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      let queue = "temperature";
      let queue2 = "smoke";
      let queue3 = "luminosity";

      channel.assertQueue(queue, {
        durable: false,
      });

      channel.consume(
        queue,
        function (msg) {
          console.log(
            "[temp-sens] A temperatura é de %s graus Celsius",
            msg.content.toString()
          );
          socket.emit("temperature-sensor", msg.content.toString());
        },
        {
          noAck: true,
        }
      );

      channel.assertQueue(queue2, {
        durable: false,
      });

      channel.consume(
        queue2,
        function (msg) {
          console.log("[smoke] %s", msg.content.toString());
          socket.emit("smoke-sensor", msg.content.toString());
        },
        {
          noAck: true,
        }
      );

      channel.assertQueue(queue3, {
        durable: false,
      });

      channel.consume(
        queue3,
        function (msg) {
          console.log("[luminosity] %s", msg.content.toString());
          socket.emit("luminosity-sensor", msg.content.toString());
        },
        {
          noAck: true,
        }
      );
    });
  });

  socket.emit("test", "Hello world");

  socket.on("ac", (data) => {
    console.log(data);
    clientAC.controlAC(
      {
        type: "AC",
        id: 1,
        temperature: data,
        active: true,
      },
      (err, res) => {
        console.log(res.success);
      }
    );
  });

  socket.on("sprinkler", (data) => {
    console.log(data);
    clientSprinkler.controlSprinkler(
      {
        type: "Sprinkler",
        id: 3,
        active: data,
      },
      (err, res) => {
        console.log(res.success);
      }
    );
  });

  socket.on("lightbulb", (data) => {
    clientLightBulb.controlLightBulb(
      {
        type: "LightBulb",
        id: 2,
        active: data,
      },
      (err, res) => {
        console.log(res.success);
      }
    );
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
