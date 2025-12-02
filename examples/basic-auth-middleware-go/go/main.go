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

func handleError(c *hono.Context, status int, msg string) {
	c.SetStatus(status)
	c.SetBody(io.NopCloser(strings.NewReader(msg + "\n")))
}

func BasicAuth(c *hono.Context, next func()) {
	req := c.Request()
	if !authenticate(req) {
		c.SetHeader("WWW-Authenticate", `Basic realm="login is required"`)
		handleError(c, http.StatusUnauthorized, "Unauthorized")
		return
	}
	next()
}

func main() {
	hono.ServeMiddleware(BasicAuth)
}
