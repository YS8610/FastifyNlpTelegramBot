"use strict";
require('dotenv').config()
const fastify = require("fastify")({
  logger: {
    level: 'info',
    file: './fastify.log' // Will use pino.destination()
  }  
});
const { telegramRoute } = require("./src/route/telegram");

const PORT = process.env.PORT;

fastify.register(require("@fastify/helmet"));
fastify.register(telegramRoute, { prefix: "/telegram" });


// Declare a route
fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

// Run the server!
const start = async () => {
  try {
    // use this if your server is on CPanel using Phusion Passenger
    // port are specific by Phusion Passenger
    await fastify.listen({path: 'passenger', host: '127.0.0.1'});
    // await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, async () => {
    await fastify.close();
    process.exit(0);
  });
});

start();
