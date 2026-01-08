import 'dotenv/config';
import { auth } from '../lib/auth';

async function main() {
  console.log('Checking auth configuration...');
  console.log(
    'EmailAndPassword enabled:',
    auth.options.emailAndPassword?.enabled
  );

  // There isn't a public API to list all routes easily, but we can check if sendResetPassword is defined
  console.log(
    'sendResetPassword configured:',
    typeof auth.options.emailAndPassword?.sendResetPassword
  );

  console.log('Base URL:', auth.options.baseURL);
}

main().catch(console.error);
