#!/usr/bin/env node

let amqp = require("amqplib/callback_api");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const protoObject = protoLoader.loadSync(
  path.resolve(__dirname, "./actuators/actuators.proto")
);
const actuatorsProto = grpc.loadPackageDefinition(protoObject);

// const clientAC = new actuatorsProto.ActuatorService(
//   "localhost:50051",
//   grpc.credentials.createInsecure()
// );

// const clientLightBulb = new actuatorsProto.ActuatorService(
//   "localhost:50052",
//   grpc.credentials.createInsecure()
// );

const clientSprinkler = new actuatorsProto.ActuatorService(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

// clientAC.controlAC(  
//   {
//     type: "AC",
//     id: 1,
//     temperature: 27.0,
//     active: false,
//   },
//   (err, res) => {
//     console.log(res.success);
//   }
// );

// clientLightBulb.controlLightBulb(
//   {
//     type: "LightBulb",
//     id: 2,
//     active: true,
//   },
//   (err, res) => {
//     console.log(res.success);
//   }
// );

clientSprinkler.controlSprinkler(
  {
    type: "Sprinkler",
    id: 3,
    active: true,
  },
  (err, res) => {
    console.log(res.success);
  }
);



// amqp.connect("amqp://localhost", function (error0, connection) {
//   if (error0) {
//     throw error0;
//   }
//   connection.createChannel(function (error1, channel) {
//     if (error1) {
//       throw error1;
//     }

//     let queue = "temperature";
//     let queue2 = "smoke";
//     let queue3 = "luminosity";

//     channel.assertQueue(queue, {
//       durable: false,
//     });

//     channel.consume(
//       queue,
//       function (msg) {
//         console.log(
//           "[temp-sens] A temperatura é de %s graus Celsius",
//           msg.content.toString()
//         );
//       },
//       {
//         noAck: true,
//       }
//     );

//     channel.assertQueue(queue2, {
//       durable: false,
//     });

//     channel.consume(
//       queue2,
//       function (msg) {
//         console.log("[smoke] %s", msg.content.toString());
//       },
//       {
//         noAck: true,
//       }
//     );

//     channel.assertQueue(queue3, {
//       durable: false,
//     });

//     channel.consume(
//       queue3,
//       function (msg) {
//         console.log("[luminosity] %s", msg.content.toString());
//       },
//       {
//         noAck: true,
//       }
//     );
//   });
// });
