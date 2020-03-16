const { API_KEY_PIXABAY } = process.env;

exports.handler = async (event, context, callback) => {
    console.log(API_KEY_PIXABAY)
    callback(null, {
        statusCode: 200,
        body: API_KEY_PIXABAY
    });
};