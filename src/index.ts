import { setupLogging } from "mynth-logger";
import { loadVaultConfig } from "mynth-helper";
import Fastify from "fastify";
import proxyRoute from "proxy";
import cors from "@fastify/cors";
import config from "config";

const start = async () => {
  await loadVaultConfig();
  const host = config.get<string>("server.host");
  const port = config.get<number>("server.port");

  const server = Fastify({
    logger: setupLogging(),
    disableRequestLogging: true,
  });

  server.register(cors);
  server.register(proxyRoute);

  server.get("/status", (_, rep) => {
    rep.send({ status: "okay" });
  });

  server.listen({ host, port }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
};

start();
