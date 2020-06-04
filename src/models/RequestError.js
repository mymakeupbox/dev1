export class RequestError extends Error {
    statusCode;
    obj;

    constructor(statusCode, message, obj){
        super(message);
        this.statusCode = statusCode;
        this.obj = obj;
    }
}