const { API_KEY_PIXABAY } = process.env;

exports.handler = async (event, context, callback) => {
    // Only allow POST method
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }
    console.log(API_KEY_PIXABAY)
    const queryParam = querystring.parse(event.body);
    const url = "https://pixabay.com/api/?key=" + API_KEY_PIXABAY + "&" + queryParam;
    fetch(url)
        .then(response => response.json())
        .then(result => {
            return {
                statusCode: 200,
                body: result
            }
        });
};