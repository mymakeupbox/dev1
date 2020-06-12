
const APIGatewayEvent = require('aws-lambda').APIGatewayEvent;
const ScheduledEvent = require('aws-lambda').ScheduledEvent;
const RequestError = require('./models/RequestError');
const DynamoController = require('./controller/DynamoController');
const Response = require('./models/Response');
const LoggingHelper = require('./utils/LoggingHelper');
const ResponseHelper = require('./utils/ResponseHelper');
const User = require('./models/User');

const ResourcesEnum = {
    RETRIEVE_USER: "/getUserById",
    CHECK_SUBSCRIBER: "/isUserSubscribed"
}

const HttpCodesEnum = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    PRECONDITION_FAILED: 412,
    UNPROCESSABLE_ENTITY: 422,
    SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501
};





/**
 * handleApiRequest
 * - Handle the api request from the API Gateway
 * @param {obj} event 
 */
exports.handler = async (event, context) => {

    var apiRequestId = event.requestContext.requestId;
    //var lambdaRequestId = context.awsRequestId;

    // Create a logger based on the lambdaRequestId header value
    const loggingHelper = LoggingHelper.getInstance(apiRequestId);


    loggingHelper.info('Handler event', event);

    // Create an instance of the reponse helper object
    const responseHelper = new ResponseHelper(event, loggingHelper);

    // based on the resource i.e. /retrieveUser do some logic
    switch (event.path) {

        // process the API call to /retrieveUser
        case ResourcesEnum.RETRIEVE_USER:
            try {

                const userId = event.queryStringParameters.userId;

                // Get a new instance of the database controller and then add a new user.
                const response = await DynamoController.getInstance(loggingHelper).getUserById(userId);
                return responseHelper.getSuccessfulResponse(
                    new Response(HttpCodesEnum.OK, JSON.stringify(response))
                );

            } catch (err) {
                // return an error if anythin in the try block fails
                return responseHelper.getErrorResponse(err);
            }

            break;
            // Check if the user is subscribe or not
        case ResourcesEnum.CHECK_SUBSCRIBER:

            try {
                // Get the request body object from the request body
                const request = JSON.parse(event.body);

                // Get a new instance of the database controller and then add a new user.
                const response = await DynamoController.getInstance(loggingHelper).checkSubscriber(request.userId);

                return responseHelper.getSuccessfulResponse(
                    new Response(HttpCodesEnum.OK, response)
                );

            } catch (err) {
                // return an error if anythin in the try block fails
                return responseHelper.getErrorResponse(err);
            }

            break;

        default:
            break;
    }
    // Here the api resource endpoint is not setup
    const error = new RequestError(HttpCodesEnum.BAD_REQUEST, `Resource doesn't exist - ${JSON.stringify(event.resource)}`, {});
    return responseHelper.getErrorResponse(error);
}