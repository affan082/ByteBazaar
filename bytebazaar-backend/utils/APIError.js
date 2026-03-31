class APIError {
    constructor(statusCode, message, errorCode = "UNKNOWN_ERROR", details = null) {
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        this.message = message;
    }
}

module.exports = APIError; 