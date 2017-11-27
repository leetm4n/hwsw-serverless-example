const { S3 } = require('aws-sdk');

const s3 = new S3();

const formatResponse = resp => ({
  body: JSON.stringify(resp.body),
  statusCode: resp.statusCode,
  headers: {
    'content-type': 'application/json',
  },
});

const badRequestResponse = (message) => {
  console.log(`Bad Request - ${message}`);
  return formatResponse({ statusCode: 400, body: { message } });
};
const internalServerErrorResponse = formatResponse({ statusCode: 500, body: { message: 'Internal Server Error' } });
module.exports = (event, context, callback) => {
  try {
    const { body, queryStringParameters } = event;

    if (!queryStringParameters) {
      return callback(null, badRequestResponse('Query string \'type\' must be set'));
    }

    let bodyParsed;
    try {
      bodyParsed = JSON.parse(body);
    } catch (err) {
      return callback(null, badRequestResponse('Body is a malformed JSON'));
    }
    if (!(bodyParsed && bodyParsed.fileName)) {
      return callback(null, badRequestResponse('Body must have parameter fileName'));
    }

    const baseOptions = {
      Bucket: process.env.STORAGE_BUCKET,
      Key: `${event.requestContext.authorizer.sub}/${bodyParsed.fileName}`,
      Expires: 300,
    };

    switch (queryStringParameters.type) {
      case 'get':
        return callback(null, formatResponse({
          body: {
            url: s3.getSignedUrl('getObject', baseOptions),
            method: 'GET',
            expiresIn: 300,
          },
          statusCode: 200,
        }));
      case 'set':
        return callback(null, formatResponse({
          body: {
            url: s3.getSignedUrl('putObject', baseOptions),
            method: 'PUT',
            expiresIn: 300,
          },
          statusCode: 200,
        }));
      default:
        return callback(null, badRequestResponse('Query string \'type\' must be equal \'get\' or \'set\''));
    }
  } catch (err) {
    // Log the error to the console;
    console.error(err.message);
    return callback(internalServerErrorResponse);
  }
};
