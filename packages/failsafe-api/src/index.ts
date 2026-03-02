import { serve } from '@hono/node-server';
import { createApp } from './server.js';
import { getConfig } from './config.js';

const config = getConfig();
const app = createApp(config);

serve(
  {
    fetch: app.fetch,
    port: config.port,
    hostname: config.host,
  },
  (info) => {
    console.log(`FailSafe API server running at http://${config.host}:${info.port}`);
  }
);

export { createApp } from './server.js';
export type { AppContext } from './server.js';
export type { StorageInterface } from './storage/storage.js';
export { MemoryStorage } from './storage/memory.js';
