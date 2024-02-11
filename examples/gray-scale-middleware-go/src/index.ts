import { Hono } from "hono";
import { go } from "@syumai/hono-middleware-go";
import mod from "../wasm/middleware.wasm";

const app = new Hono();

const imagePath = "https://syum.ai/image";

app.get("/image", (c) => {
  return fetch(imagePath);
});

app.get("/image-gray", go(mod), () => {
  return fetch(imagePath);
});

export default app;
