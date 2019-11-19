export function respondString(response) {
    if (Array.isArray(response)) {
        return response.map(function (r) { return respondString(r); });
    }
    else {
        return new String(response.text);
    }
}
export function respondError(response) {
    console.log("Error in ExampleAPI response", response);
    throw response;
}
//# sourceMappingURL=index.js.map