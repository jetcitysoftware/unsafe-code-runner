package main

import (
    "fmt"
    gonode "github.com/jgranstrom/gonodepkg"
    json "github.com/jgranstrom/go-simplejson"
)

func main() {
    gonode.Start(process)
}

func process(cmd *json.Json) (response *json.Json) {

  name := cmd.Get("user").MustString();

  response, m, error := json.MakeMap()

  m["error"] = error
  m["body"] = fmt.Sprintf("Hello, %s, from Go", name);

  return
}
