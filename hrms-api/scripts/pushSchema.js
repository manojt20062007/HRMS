const { execSync } = require('child_process');
require('dotenv').config();

const url = new URL(process.env.DATABASE_URL);
url.searchParams.set('schema', 'schema_pmj');
const dbUrl = url.toString();
console.log('Pushing to: ' + dbUrl);

execSync('npx prisma db push --accept-data-loss', {
  env: { ...process.env, DATABASE_URL: dbUrl },
  stdio: 'inherit'
});
