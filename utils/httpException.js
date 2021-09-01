class HttpException extends Error {
    constructor(statusCode, status, message, data) {
        super(message);
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}

module.exports = HttpException;