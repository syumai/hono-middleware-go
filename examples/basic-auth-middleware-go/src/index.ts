import { Hono } from "hono";
import { go } from "@syumai/hono-middleware-go";
import mod from "../wasm/middleware.wasm";

const app = new Hono();

app.use(go(mod));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
