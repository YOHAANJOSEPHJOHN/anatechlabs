
import { EventEmitter } from 'events';

// Since we're in a single-process environment (browser/server), a simple EventEmitter is fine.
// For multi-process or serverless environments, you might need a more robust pub/sub system.
export const errorEmitter = new EventEmitter();
