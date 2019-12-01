const fetchMock = require("fetch-mock");
global.fetch = fetchMock.sandbox();
