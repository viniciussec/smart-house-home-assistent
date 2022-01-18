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

      let msg = defaultValue ? "Tem fumaça" : "Não tem fumaça";

      channel.sendToQueue(queue, Buffer.from(msg));
      console.log(" [x] Enviado: %s", msg);
    }, 5000);
  });
});
