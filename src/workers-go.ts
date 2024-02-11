import { Context, Env } from "hono";
import { connect } from "cloudflare:sockets";
import "./wasm_exec_common.js";
import "./wasm_exec_go.js";
import "./wasm_exec_tinygo.js";

declare const Go: any;
declare const TinyGo: any;

Object.defineProperty(globalThis, "tryCatch", {
  value: (fn: () => void) => {
    try {
      return {
        result: fn(),
      };
    } catch (e) {
      return {
        error: e,
      };
    }
  },
  writable: false,
});

export function createRuntimeContext<E extends Env = any>(
  env: E,
  ctx: Context,
  binding: object
) {
  return {
    env,
    ctx,
    connect,
    binding,
  };
}

export async function run(
  ctx: ReturnType<typeof createRuntimeContext>,
  mod: WebAssembly.Module,
  isTinyGo = false
) {
  const go = isTinyGo ? new TinyGo() : new Go();

  let ready: (v?: unknown) => void;
  const readyPromise = new Promise((resolve) => {
    ready = resolve;
  });
  const instance = new WebAssembly.Instance(mod, {
    ...go.importObject,
    workers: {
      ready: () => {
        ready();
      },
    },
  });
  go.run(instance, ctx);
  await readyPromise;
}
