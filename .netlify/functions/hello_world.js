exports.handler = async (event, context) => {
    // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const params = JSON.parse(event.body);
  console.log(params);

    return {
      statusCode: 200,
      body: {"Hello, World"}
    };
  };