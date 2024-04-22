import axios from "axios";
import config from "config";
import { FastifyInstance } from "fastify";

type Network = "mainnet" | "preprod" | "preview" | "sanchonet";

const proxyRoute = async (server: FastifyInstance) => {
  server.get<{ Params: { network: Network; postfix: string } }>(
    "/api/blockfrost/:network/*",
    async (request, reply) => {
      const { network } = request.params;
      const projectId = config.get<string>("blockfrost.project_id");
      const blockfrostNetwork = network.toLowerCase();
      const configName = `blockfrost.${blockfrostNetwork}.url`;

      if (!projectId.startsWith(blockfrostNetwork.slice(0, 7))) {
        reply.code(400).send({ error: "Invalid network" });
        return;
      }

      if (!config.has(configName)) {
        reply.code(500).send({ error: "Network is misconfigured" });
        return;
      }

      const baseUrl = config.get<string>(configName);

      try {
        const path = sanitize(request.url);
        const url = `${baseUrl}${path.substring(`/api/blockfrost/${network}`.length)}`;
        console.debug("URL:", url);
        const response = await axios.get(url, {
          headers: {
            project_id: projectId,
          },
        });
        reply.code(response.status).send(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );
};

const sanitize = (path: string) => path.replace(/[^a-zA-Z0-9/_.?=&-]/g, "");

export default proxyRoute;
