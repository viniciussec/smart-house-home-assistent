#!/usr/bin/env node

let amqp = require("amqplib/callback_api");
const fs = require("fs");

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    let queue = "temperature";

    channel.assertQueue(queue, {
      durable: false,
    });

    setInterval(function () {
      const file = fs.readFileSync("../ambient.json", {
        encoding: "utf8",
        flag: "r",
      });
      const defaultValue = JSON.parse(file).temperature;

      const msgObj = {
        type: "temperature-sensor",
        temperature: `${defaultValue + Math.random()}`.substring(0, 5),
      };

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(msgObj)));
      console.log(" [x] Enviado: %s", msgObj);
    }, 3000);
  });
});
