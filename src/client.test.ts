import { MLDSClient, encodeParams } from "./client";
import fetchMock from "fetch-mock";

const client = new MLDSClient({
  host: "http://localhost:8087",
  apiRoot: "/v1/resources/"
});

const test_url = "http://localhost:8087/v1/resources/";

describe("MLDSClient", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("it calls an endpoint", done => {
    fetchMock.mock(test_url + "test/test.sjs", "Hi");
    client.call("test").then(async data => {
      const str = await data.text();
      expect(str).toEqual("Hi");
      done();
    });
  });

  test("it passes parameters", done => {
    fetchMock.mock(test_url + "test/test.sjs", "yohoyoho");
    const test_params = { greeting: "yoho", frequency: 2 };
    client.call("test", { params: test_params }).then(async data => {
      const str = await data.text();
      expect(fetchMock.lastOptions()!.body).toEqual(encodeParams(test_params));
      expect(str).toEqual("yohoyoho");
      done();
    });
  });

  test("it supports a session", done => {
    fetchMock.mock(test_url + "first/first.sjs", "one");
    fetchMock.mock(test_url + "second/second.sjs", "two");
    client
      .startSession()
      .call("first")
      .call("second")
      .done()
      .then(async data => {
        expect(data.length).toEqual(2);
        expect(data.join("")).toEqual("onetwo");
        done();
      });
  });

  test("it can handle multiple json responses", done => {
    fetchMock.mock(test_url + "first/first.sjs", { foo: "bar" });
    fetchMock.mock(test_url + "second/second.sjs", { bar: "baz" });
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
