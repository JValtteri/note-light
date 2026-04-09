package main

import (
    "fmt"
    "github.com/JValtteri/note-light/server/internal/server"
	"github.com/JValtteri/note-light/server/internal/utils"
)

func main() {
	PrintStylizedLogo()
	PrintAttribution()
    server.Server()
    fmt.Println("### Server Stopped ###")
}

func PrintStylizedLogo() {
	fmt.Printf("\n%s%s%s\n",
		"  █\n",
		"  █      Note Light (c) Fast Note application server\n",
		"  █\n\n",
	)
}

func PrintAttribution() {
	var attrStr = utils.ReadFile("ATTRIBUTION")
	fmt.Printf("%s\n", attrStr)
}
