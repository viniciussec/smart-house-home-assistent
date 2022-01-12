#!/usr/bin/env node

var amqp = require("amqplib/callback_api");

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
      let msg = `${20 + Math.random()}`.substring(0, 5);
      channel.sendToQueue(queue, Buffer.from(msg));
      console.log(" [x] Enviado: %s", msg);
    }, 3000);
  });
});
