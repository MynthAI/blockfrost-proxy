import axios from "axios";
import config from "config";
import { FastifyInstance } from "fastify";

const proxyRoute = async (server: FastifyInstance) => {
  server.get<{ Params: { network: "mainnet" | "preprod"; postfix: string } }>(
    "/api/blockfrost/:network/*",
    async (request, reply) => {
      const { network } = request.params;

      const baseUrl =
        network.toLowerCase() === "mainnet"
          ? config.get<string>("blockfrost.mainnet.url")
          : config.get<string>("blockfrost.preprod.url");
      const headers = {
        headers: {
          project_id: config.get<string>("blockfrost.project_id"),
        },
      };

      try {
        const url = `${baseUrl}${request.url.substring(`/api/blockfrost/${network}`.length)}`;
        console.debug("URL:", url);
        const response = await axios.get(url, headers);
        reply.code(response.status).send(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );
};

export default proxyRoute;
