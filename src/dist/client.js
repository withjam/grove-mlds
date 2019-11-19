var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var MLDSClient = /** @class */ (function () {
    function MLDSClient(opts) {
        var _this = this;
        this.call = function (endpoint, opts) {
            return fetch(endpoint);
        };
        this.callWithSession = function (session, endpoint, opts) {
            if (session.former) {
                session.former.then(function (res) {
                    return _this.call(endpoint, __assign(__assign({}, opts), { session: __assign({}, session) }));
                });
            }
            else {
                session.former = _this.call(endpoint, __assign(__assign({}, opts), { session: __assign({}, session) }));
            }
            // allow chaining
            return {
                call: _this.callWithSession.bind(session),
                done: function () { return session.former; }
            };
        };
        this.startSession = function () {
            var session = { promises: [] };
            return {
                call: _this.callWithSession.bind(session)
            };
        };
        this.opts = opts;
    }
    return MLDSClient;
}());
export { MLDSClient };
//# sourceMappingURL=client.js.map