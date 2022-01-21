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

    let queue = "smoke";

    channel.assertQueue(queue, {
      durable: false,
    });

    setInterval(function () {
      const file = fs.readFileSync("../ambient.json", {
        encoding: "utf8",
        flag: "r",
      });
      const defaultValue = JSON.parse(file).smoke;

      const msgObj = {
        type: "smoke-sensor",
        isSmoke: defaultValue,
      };

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(msgObj)));
      console.log(" [x] Enviado: %s", msgObj);
    }, 5000);
  });
});
