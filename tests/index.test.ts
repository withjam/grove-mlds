import { MLDSClient } from "../src/client";
import { ExampleAPI } from "../api-example";

const client = new MLDSClient({
  host: "localhost",
  ssl: false,
  apiRoot: "/"
});

client
  .startSession()
  .call("foo")
  .call("bar", { params: { arg1: "baz" } })
  .done()
  .then(response => {});

(async () => {
  const val = await client.call("helloWorld", {
    params: { greeting: "Hey", frequency: 2 }
  });
})();

async () => {
  const val = await ExampleAPI.on(client).HelloWorld({
    greeting: "Hey",
    frequency: 2
  });
};
