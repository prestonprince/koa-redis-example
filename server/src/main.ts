import dotenv from "dotenv";
import Koa from "koa";
import bodyParser from "koa-body";
import cors from "@koa/cors";
import json from "koa-json";
import http from "http";

import { addRedisPublisher } from "./redis/publisher/publisher";
import { addRedisSubscriber } from "./redis/subscriber/subscriber";
import { ApiRoutes } from "./routes/api";
import { addSocketIO } from "./io/socket";
import { addRedisDataWorker } from "./redis/data/redis.data";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3001", 10);

const REDIS_URL = process.env.UPSTASH_REDIS_URL;
if (!REDIS_URL) {
  console.error("MISSING REDIS URL");
  process.exit(1);
}
export const pubClient = addRedisPublisher(REDIS_URL);
export const subClient = addRedisSubscriber();
export const dataWorker = addRedisDataWorker(REDIS_URL);

const app = new Koa();

app.use(cors());
app.use(
  bodyParser({
    formLimit: "1mb",
    includeUnparsed: true,
    multipart: true, // Allow multiple files to be uploaded
    formidable: {
      maxFileSize: 200 * 1024 * 1024, // Upload file size
      keepExtensions: true, // Extensions to save images
    },
  })
);

app.use(json());

app.use(ApiRoutes);

const server = http.createServer(app.callback());
export const io = addSocketIO(server);

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

process.on("beforeExit", async () => {
  await Promise.all([
    pubClient.disconnect(),
    subClient.disconnect(),
    dataWorker.disconnect(),
  ]);
});
