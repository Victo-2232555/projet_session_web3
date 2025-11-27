
// tests/setup-env.ts
// d'après ChatGPT
import { loadEnv } from 'vite';


// console.log('Loading test environment variables from .env.test');
const env = loadEnv('test', process.cwd(), '');
Object.assign(process.env, env);
