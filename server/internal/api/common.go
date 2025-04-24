package api

import (
	"encoding/json"
	"io"
	"net/http"

	"go.uber.org/zap"
)

// logHandler is implemented by handlers with an associated logger. It enables
// handlers to quickly write a JSON response using encodeJSON.
type logHandler interface {
	Logger() *zap.Logger
	RegisterRoutes(mux *http.ServeMux)
}

// decodeInto tries to decode r into val using json.Decode
func decodeInto(r io.ReadCloser, val any) error {
	defer r.Close()

	decoder := json.NewDecoder(r)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&val); err != nil {
		return err
	}

	return nil
}

// encodeJSON tries to encode val into w using json.Encode.
//
// Errors are written to w and a 500 is sent.
func encodeJSON(h logHandler, w http.ResponseWriter, val any) {
	if err := json.NewEncoder(w).Encode(val); err != nil {
		h.Logger().Sugar().Error(err)
		http.Error(w, errInternal.Error(), http.StatusInternalServerError)

		return
	}
}
