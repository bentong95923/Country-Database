const { ENV_VAR } = process.env;

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: ENV_VAR
  };
};