const jwt = require('jsonwebtoken');

const response = 'Unauthorized';

module.exports = (event, context, callback) => {
  if (!event.authorizationToken) {
    console.log('No token');
    return callback(response);
  }

  const [type, token] = event.authorizationToken.split(' ');

  if (type.toLowerCase() !== 'bearer' || !token) {
    console.log('No token or not bearer');
    return callback(response);
  }

  return jwt.verify(token, process.env.AUTH_SECRET, (error, decoded) => {
    if (error) {
      console.log('JWT verification failed');
      return callback(response);
    }

    // Create an inline policy that enables execution of target Lambda
    const returnValue = {
      principalId: decoded.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn,
        }],
      },
      context: { sub: decoded.sub },
    };

    console.log('Authenticated sub:', decoded.sub);
    return callback(null, returnValue);
  });
};
