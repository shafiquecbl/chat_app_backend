

const customError = (err) => {
    console.log(err);
    res.status(500).json({
        error: err.message
    });
}



module.exports = { customError };
