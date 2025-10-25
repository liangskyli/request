import { createRequire } from 'node:module';
import { defineConfig } from 'rollup';
import { getConfig } from '../rollup.base.config.js';

const require = createRequire(import.meta.url);
const packageJSON = require('./package.json');

export default defineConfig([getConfig(packageJSON)]);
