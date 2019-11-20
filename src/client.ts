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
  port?: number;
  ssl?: boolean;
  apiRoot?: string;
}

export class MLDSClient {
  opts: ClientOpts;
  constructor(opts: ClientOpts) {
    this.opts = opts;
  }

  call = (endpoint: string, opts?: CallOpts): Promise<Response> => {
    return fetch(endpoint);
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
