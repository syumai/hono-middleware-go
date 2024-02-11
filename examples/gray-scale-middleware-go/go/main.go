package main

import (
	"bytes"
	"image"
	"image/draw"
	"image/png"
	"io"
	"net/http"
	"strings"
	"syscall/js"

	"github.com/syumai/workers/exp/hono"
)

func GrayScale(c *hono.Context, next func()) {
	next()
	img, _, err := image.Decode(c.ResponseBody())
	baseResp := c.RawResponse()
	c.SetResponse(js.Undefined()) // clean up the previous response
	if err != nil {
		respObj := hono.NewJSResponse(
			io.NopCloser(strings.NewReader("invalid image format")),
			http.StatusBadRequest,
			nil,
		)
		c.SetResponse(respObj)
		return
	}

	result := image.NewGray(img.Bounds())
	draw.Draw(result, result.Bounds(), img, img.Bounds().Min, draw.Src)

	var buf bytes.Buffer
	if err = png.Encode(&buf, result); err != nil {
		respObj := hono.NewJSResponse(
			io.NopCloser(strings.NewReader("failed to encode image")),
			http.StatusBadRequest,
			nil,
		)
		c.SetResponse(respObj)
		return
	}
	respObj := hono.NewJSResponseWithBase(
		io.NopCloser(&buf),
		baseResp,
	)
	c.SetResponse(respObj)
}

func main() {
	hono.ServeMiddleware(GrayScale)
}
