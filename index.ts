import { httpServer } from './src/http_server/index.js';
import * as Config from './src/config.js';
import { wsServer } from './src/ws_server/index.js';


console.log(`Start static http server on the ${Config.HTTP_PORT} port!`);
httpServer.listen(Config.HTTP_PORT);

process.on('SIGINT', () => {
  console.log('\nGame Over');
  wsServer.close();
  httpServer.close();
  process.exit();
});