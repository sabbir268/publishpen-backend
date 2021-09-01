class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;

// class HttpException extends Error {
//     constructor(status, message, data) {
//         super(message);
//         this.status = status;
//         this.message = message;
//         this.data = data;
//     }
// }

// module.exports = HttpException;