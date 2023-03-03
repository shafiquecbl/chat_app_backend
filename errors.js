const { model } = require("mongoose");

 const urlError = (request,response,next)=>{
    const error = new Error('Url not found');
    error.status = 400;
    next(error);
}

 const customError = (error,request,response,next)=>{
   response.status(error.status || 500);

   response.json({
       error: error.message
   });
}

module.exports = {urlError, customError};
