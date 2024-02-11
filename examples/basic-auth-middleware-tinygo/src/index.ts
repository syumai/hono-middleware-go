import { Hono } from "hono";
import { tinygo } from "@syumai/hono-middleware-go";
import mod from "../wasm/middleware.wasm";

const app = new Hono();

app.use(tinygo(mod));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
