import { MLDSClient } from "./client";
import { ExampleAPI } from "../api-example";

function mockFetch(data: any) {
  (global as any).fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      text: () => data
    })
  );
}

const client = new MLDSClient({
  host: "localhost",
  ssl: false,
  apiRoot: "/"
});

describe("MLDSClient", () => {
  test("it calls an endpoint", done => {
    (fetch as any).mockResponseOnce("Hi");
    client.call("test").then(async data => {
      const str = await data.text();
      expect(str).toEqual("Hi");
      done();
    });
  });

  test("it supports a session", done => {
    (fetch as any).once("yo").once("ho");
    client
      .startSession()
      .call("first")
      .call("second")
      .done()
      .then(async data => {
        expect(data.length).toEqual(2);
        expect(data.join("")).toEqual("yoho");
        done();
      });
  });

  test("it can handle multiple json responses", done => {
    (fetch as any)
      .once(JSON.stringify({ foo: "bar" }))
      .once(JSON.stringify({ bar: "baz" }));
    client
      .startSession()
      .call("first")
      .call("second")
      .done()
      .then(async data => {
        expect(data.length).toEqual(2);
        expect(data.reduce((acc, val) => ({ ...acc, ...val }))).toEqual({
          foo: "bar",
          bar: "baz"
        });
        done();
      });
  });
});

// (async () => {
//   const val = await client.call("helloWorld", {
//     params: { greeting: "Hey", frequency: 2 }
//   });
// })();

// async () => {
//   const val = await ExampleAPI.on(client).HelloWorld({
//     greeting: "Hey",
//     frequency: 2
//   });
// };
