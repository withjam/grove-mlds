interface CallSession {
  raw?: any;
  former?: Promise<Response>;
  trace: Response[];
}

export interface CallOpts {
  session?: CallSession;
  params?: any;
}

export interface CallChain {
  call: (endpoint: string, opts?: CallOpts) => CallChain;
  done: () => Promise<Response[]>;
}

interface ClientOpts {
  host?: string;
  apiRoot?: string;
}

export function encodeParams(data: Object) {
  return Object.keys(data)
    .map(key => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    })
    .join("&");
}

export class MLDSClient {
  config: ClientOpts;
  constructor(opts: ClientOpts) {
    this.config = opts;
  }

  call = (endpoint: string, opts?: CallOpts): Promise<Response> => {
    const { host, apiRoot } = this.config;
    const path = `${host || window.origin}${apiRoot ||
      "/"}${endpoint}/${endpoint}.sjs`;
    if (!opts) opts = {};
    return fetch(path, {
      method: "POST", // always post for data services
      mode: "cors",
      cache: "no-cache", // maybe make this an option?  To avoid any issues, for now, don't use cache
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: encodeParams(
        opts.session
          ? { ...opts.params, session: opts.session.raw }
          : opts.params || {}
      )
    });
  };

  callWithSession = (
    session: CallSession,
    endpoint: string,
    opts?: CallOpts
  ): CallChain => {
    let nextCall: Promise<any>;
    if (session.former) {
      nextCall = session.former
        .then(response =>
          response
            .clone()
            .json()
            .catch(() => response.clone().text())
        )
        .then(response => {
          session.trace.push(response);
          return this.call(endpoint, {
            ...opts,
            session
          });
        });
    } else {
      nextCall = Promise.resolve(
        this.call(endpoint, {
          ...opts,
          session
        })
      );
    }
    // allow chaining
    const nextSession = { ...session, former: nextCall };
    return {
      call: (endpoint: string, opts?: CallOpts) =>
        this.callWithSession(nextSession, endpoint, opts),
      done: () =>
        nextSession.former
          .then(response =>
            response
              .clone()
              .json()
              .catch(() => response.clone().text())
          )
          .then(res => {
            return [...session.trace, res];
          })
    };
  };

  startSession = (): {
    call: (endpoint: string, opts?: CallOpts) => CallChain;
  } => {
    return {
      call: (endpoint: string, opts?: CallOpts) =>
        this.callWithSession(
          {
            trace: [] as Response[]
          },
          endpoint,
          opts
        )
    };
  };
}
