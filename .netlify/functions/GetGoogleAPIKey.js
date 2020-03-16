const { API_KEY_GOOGLE } = process.env;

exports.handler = async (event, context, callback) => {
    console.log(API_KEY_GOOGLE)
  return {
    statusCode: 200,
    body: API_KEY_GOOGLE
  };
};