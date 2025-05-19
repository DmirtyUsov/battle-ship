const DEFAULT_HTTP_PORT = 8181;
const DEFAULT_WS_PORT = 3005;

export const HTTP_PORT: number = (process.env.HTTP_PORT ||
  DEFAULT_HTTP_PORT) as number;
export const WS_PORT: number = (process.env.WS_PORT ||
  DEFAULT_WS_PORT) as number;
