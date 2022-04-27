class Credentials {
  hostname: string;
  user: string;
  password: string;
  port: number;

  constructor(hostname: string, user: string, password: string, port: number) {
    this.hostname = hostname;
    this.user = user;
    this.password = password;
    this.port = port;
  }

  setHostname = (hostname: string) => {
    this.hostname = hostname;
  };

  setUser = (user: string) => {
    this.user = user;
  };

  setPassword = (password: string) => {
    this.password = password;
  };

  setPort = (port: number) => {
    this.port = port;
  };
}

export default Credentials;
