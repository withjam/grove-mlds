import { MLDSClient } from "./client";
import fetchMock from "fetch-mock";

const GeneratedClient = {
  on: (client: MLDSClient) => {
    return new GeneratedClientAPI(client);
  }
};

class GeneratedClientAPI {
  client: MLDSClient;

  constructor(client: MLDSClient) {
    this.client = client;
  }

  HelloWorld = (args: { greeting: string; frequency: number }) => {
    const { greeting, frequency } = args;

    return this.client
      .call("helloWorld", {
        params: {
          greeting,
          frequency
        }
      })
      .then(response => {
        if (!response.ok) {
          throw "Invalid response";
        }
        return response.text();
      });
  };
}

const test_url = "http://localhost:8087/v1/resources/";

const client = new MLDSClient({
  host: "localhost",
  port: 8087,
  ssl: false,
  apiRoot: "/v1/resources/"
});

describe("Generated client", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("it calls an endpoint", async done => {
    fetchMock.mock(test_url + "helloWorld/helloWorld.sjs", "HiHi");
    const greeting = "Hi";
    const frequency = 2;
    const str = await GeneratedClient.on(client).HelloWorld({
      greeting,
      frequency
    });
    expect(str).toEqual("HiHi");
    expect(JSON.parse(fetchMock.lastOptions()!.body + "")).toEqual({
      greeting,
      frequency
    });
    done();
  });
});
