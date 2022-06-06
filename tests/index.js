
import https from 'https';
import fs from 'fs';

export function fetch(url, options = {}) {
  options.agent = new https.Agent({
    rejectUnauthorized: false,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {

        try {
          data = JSON.parse(data);
        } catch (e) {
          data = data;
        }

        resolve({ ...res, data });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Clear RuimDatabase
if (fs.existsSync(process.env.STORAGE_PATH)) {
  fs.rmSync(process.env.STORAGE_PATH, { recursive: true });
}

// Clear old test output
if (fs.existsSync('tests/.output.txt')) {
  fs.rmSync('tests/.output.txt');
}

const consoleLogger = console.log;
function testLogger(message) {
  if (typeof(message) !== 'string') {
    message = JSON.stringify(message);
  }

  fs.writeFileSync('tests/.output.txt', message, { flag: 'a' });
}

async function testModule(m, name) {
  console.log('Running test module: ' + name);
  for (const key of Object.keys(m)) {
    process.stdout.write('  ' + key + ': ');

    if (typeof m[key] !== 'function') {
      console.log('SKIPPED');
      return;
    }

    try {
      testLogger('----------------------------------');
      testLogger('\n-- ' + name + '.' + key + '()\n');
      testLogger('----------------------------------\n\n');
      console.log = testLogger;

      await m[key]();
      testLogger('\n\n-- END: SUCCESS\n');
      console.log = consoleLogger;
      console.log('OK');
    } catch (e) {
      testLogger('\n\n-- END: FAIL\n');
      console.log = consoleLogger;
      console.log('FAILED: ' + e.message);
    }

    testLogger('----------------------------------\n\n\n\n');
  };
}



import user, { init as initUser } from "./user.js";
import token, { init as initToken } from "./token.js";

(async () => {
  try {
    process.stdout.write('Initializing user test module... ');
    await initUser();
    console.log('OK');
  } catch (e) {
    console.log('Error on initializing user testing module: ' + e.message);
    return;
  }
  try {
    process.stdout.write('Initializing token test module... ');
    await initToken();
    console.log('OK');
  } catch (e) {
    console.log('Error on initializing token testing module: ' + e.message);
    return;
  }

  await testModule(user, 'user');
  await testModule(token, 'token');
})();
