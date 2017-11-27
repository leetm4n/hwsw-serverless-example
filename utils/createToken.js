const assert = require('assert');
const jwt = require('jsonwebtoken');

const env = require('../.env.json');

function main() {
  const [user] = process.argv.slice(2);
  const authSecret = env.AUTH_SECRET;

  assert(authSecret, 'Auth secret must be set');
  assert(user, 'First argument has to be set (username)');

  const createToken = sub => jwt.sign({ sub }, authSecret, { noTimestamp: true });
  console.log(createToken(user));
}

main();
