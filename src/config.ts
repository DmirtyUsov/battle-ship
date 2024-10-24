import dotenv from 'dotenv';

const DEFAULT_HTTP_PORT = 8181;
const DEFAULT_WS_PORT = 3000;

dotenv.config();

export const HTTP_PORT = process.env.HTTP_PORT || DEFAULT_HTTP_PORT;
export const WS_PORT = process.env.WS_PORT || DEFAULT_WS_PORT;
