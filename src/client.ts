interface CallSession {
  raw?: any;
  former?: Promise<Response>;
}

export interface CallOpts {
  session?: CallSession;
  params?: any;
}

export interface CallChain {
  call: (endpoint: string, opts?: CallOpts) => CallChain;
  done: () => Promise<Response>;
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
    if (session.former) {
      session.former.then(res =>
        this.call(endpoint, { ...opts, session: { ...session } })
      );
    } else {
      session.former = this.call(endpoint, {
        ...opts,
        session: { ...session }
      });
    }
    // allow chaining
    return {
      call: this.callWithSession.bind(session),
      done: () => session.former
    };
  };

  startSession = (): {
    call: (endpoint: string, opts?: CallOpts) => CallChain;
  } => {
    const session = {};
    return {
      call: this.callWithSession.bind(session)
    };
  };
}
