
const urlError = (request, response, next) => {
    const error = new Error('Url not found');
    error.status = 400;
    next(error);
}

const customError = (err) => {
    console.log(err);
    res.status(500).json({
        error: err.message
    });
}



module.exports = { urlError, customError };
