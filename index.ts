import { httpServer } from './src/http_server/index.js';
import * as Config from './src/config.js';
//const HTTP_PORT = 8181;

console.log(`Start static http server on the ${Config.HTTP_PORT} port!`);
httpServer.listen(Config.HTTP_PORT);
