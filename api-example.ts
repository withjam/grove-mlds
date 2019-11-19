import { MLDSClient } from "./src/client";

export const ExampleAPI = {
  on: (client: MLDSClient) => {
    return new ExampleAPIClass(client);
  }
};

class ExampleAPIClass {
  client: MLDSClient;

  constructor(client: MLDSClient) {
    this.client = client;
  }

  HelloWorld = (args: { greeting: string; frequency: number }) => {
    const { greeting, frequency } = args;

    return this.client
      .call("helloWorld/helloWorld.sjs", {
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
