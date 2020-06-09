
const APIGatewayEvent = require('aws-lambda').APIGatewayEvent;
const ScheduledEvent = require('aws-lambda').ScheduledEvent; 
const RequestError = require('./models/RequestError');
const DynamoController = require('./controller/DynamoController');
const Response = require('./models/Response');
const LoggingHelper = require('./utils/LoggingHelper');
const ResponseHelper = require('./utils/ResponseHelper');
const User = require('./models/User');

const ResourcesEnum = {
    RETRIEVE_USER: "/retrieveUser",
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
 * handleFunctionEntryPoint 
 * - This is the function that will handle the event
 * @param {APIGatewayEvent | ScheduledEvent} event 
 */
const handleFunctionEntryPoint = async (event) => {
    if (isApiEvent(event)) {
        // This is an API call
        return handleApiRequest(event);
    } else {
        // This is a scheduled event i.e. a trigger from a cloudwatch event
        //return handleScheduledEvent(event);
        return;
    }
};

/**
 * isApiEvent - Check if the event is an API call
 * @param {obj} event 
 */
function isApiEvent(event){
    return (event).httpMethod !== undefined;
}

// export const handleScheduledEvent = async (event) => {
//     const correlationId = uuidv4();
//     const loggingHelper = LoggingHelper.getInstance(correlationId);
//     loggingHelper.info('Handler event', event);

//     return DynamoController.getInstance(loggingHelper).processAvailableEntries(correlationId);
// }

/**
 * handleApiRequest
 * - Handle the api request from the API Gateway
 * @param {obj} event 
 */
const handleApiRequest = async (event) => {
    // Create a logger based on the X-Correlation-ID header value
    const loggingHelper = LoggingHelper.getInstance(event.headers['X-Correlation-ID']);
    loggingHelper.info('Handler event', event);
    
    // Create an instance of the reponse helper object
    const responseHelper = new ResponseHelper(event, loggingHelper);
    
    // based on the resource i.e. /retrieveUser do some logic
    switch (event.resource) {

        // process the API call to /retrieveUser
        case ResourcesEnum.RETRIEVE_USER:
            try {
                // Get the request body object from the request body
                const request = JSON.parse(event.body);

                // Create a new user object using the data in the request body, inside this
                // generate a new ID ( maybe this changes to be the device ID erquest body attribute)
                // TODO
                const user = User.parse(request);

                // Get a new instance of the database controller and then add a new user.
                const response = await DynamoController.getInstance(loggingHelper).addNewUser(user);

                return responseHelper.getSuccessfulResponse(
                    new Response(HttpCodesEnum.CREATED, response)
                );
            } catch (err) {
                // return an error if anythin in the try block fails
                return responseHelper.getErrorResponse(err);
            }

        default:
            break;
    }
    // Here the api resource endpoint is not setup
    const error = new RequestError(HttpCodesEnum.BAD_REQUEST, `Resource doesn't exist - ${JSON.stringify(event.resource)}`, {});
    return responseHelper.getErrorResponse(error);
}

// Test call to handleFunctionEntrypoint
(async () => {
    console.log('...calling handler...');
    
    let result = await handleFunctionEntryPoint();
    console.log(JSON.stringify(result));
    console.log('...finished calling handler...');
  })();
