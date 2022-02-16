class HttpError extends Error{
    constructor(message, errorCode){
        super(message);
        this.code= error.Code;
    }
}

module.exports= HttpError;