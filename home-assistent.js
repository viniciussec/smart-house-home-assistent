#!/usr/bin/env node

let amqp = require("amqplib/callback_api");

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
      },
      {
        noAck: true,
      }
    );
  });
});


