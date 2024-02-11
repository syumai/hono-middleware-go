import { MiddlewareHandler, Next } from "hono";
import { createRuntimeContext, run } from "./workers-go.js";

type Binding = {
  runHonoMiddleware(next: Next): Promise<Response | undefined>;
};

export const go = (mod: WebAssembly.Module): MiddlewareHandler => {
  return async function go(ctx, next) {
    const binding = {} as Binding;
    await run(createRuntimeContext(ctx.env, ctx, binding), mod, false);
    await binding.runHonoMiddleware(next);
  };
};

export const tinygo = (mod: WebAssembly.Module): MiddlewareHandler => {
  return async function tinygo(ctx, next) {
    const binding = {} as Binding;
    await run(createRuntimeContext(ctx.env, ctx, binding), mod, true);
    await binding.runHonoMiddleware(next);
  };
};
