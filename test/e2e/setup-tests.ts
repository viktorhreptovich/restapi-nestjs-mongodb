import * as dotenv from 'dotenv';


const result = dotenv.config({ path: `.env.test` });

if (result.error) {
  throw new Error(`Error loading .env file: ${result.error}`);
}
