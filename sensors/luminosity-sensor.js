#!/usr/bin/env node

var amqp = require("amqplib/callback_api");
const fs = require("fs");

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    let queue = "luminosity";

    channel.assertQueue(queue, {
      durable: false,
    });

    setInterval(function () {
      const file = fs.readFileSync("../ambient.json", {
        encoding: "utf8",
        flag: "r",
      });
      const defaultValue = JSON.parse(file).light;

      const msgObj = {
        type: "luminosity-sensor",
        isLightOn: defaultValue,
      };

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(msgObj)));
      console.log(" [x] Enviado: %s", msgObj);
    }, 5000);
  });
});
