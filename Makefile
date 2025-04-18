build:
	cd server && golangci-lint run
	go build -C server -o build/server ./cmd/server/main.go

run-server:
	./server/build/server