export class Response {
    statusCode
    message
    response

    constructor(status, response, message = "") {
        this.statusCode = status;
        this.response = response;
        this.message = message;
    }
}