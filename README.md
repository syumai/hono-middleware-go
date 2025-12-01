# hono-middleware-go

* A package to write [Hono](https://github.com/honojs/hono) middleware in Go or TinyGo.
* This package is based on [syumai/workers](https://github.com/syumai/workers).

## CAUTION

* TinyGo middleware is currently broken.

## Installation

```
npm i @syumai/hono-middleware-go
```

## Usage

### Write middleware in Go

```go
package main

import (
	"io"
	"net/http"
	"strings"

	"github.com/syumai/workers/exp/hono"
)

const (
	userName     = "user"
	userPassword = "password"
)

func authenticate(req *http.Request) bool {
	username, password, ok := req.BasicAuth()
	return ok && username == userName && password == userPassword
}

func BasicAuth(c *hono.Context, next func()) {
	req := c.Request()
	if !authenticate(req) {
		c.SetHeader("WWW-Authenticate", `Basic realm="login is required"`)
		c.SetStatus(status)
		c.SetBody(io.NopCloser(strings.NewReader(msg + "\n")))
		return
	}
	next()
}

func main() {
	hono.ServeMiddleware(BasicAuth)
}
```

### Use middleware in Hono

```ts
import { Hono } from "hono";
import { tinygo } from "@syumai/hono-middleware-go";
import mod from "../wasm/middleware.wasm";

const app = new Hono();

app.use(tinygo(mod)); // or `go` for Go Wasm binary

app.get("/", (c) => c.text("foo"));

export default app;
```

## Author

syumai

## License

MIT
