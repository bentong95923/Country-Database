exports.handler = async (event, context) => {
    const { GREETING } = process.env;
    console.log(GREETING)
};