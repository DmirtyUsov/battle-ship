import { HTTP_PORT } from './src/config.js';
import { httpServer } from './src/http_server/index.js';

import { wsServer } from './src/ws_server/index.js';

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

process.on('SIGINT', () => {
  console.log('\nGame Over');
  wsServer.close();
  httpServer.close();
  process.exit();
});
