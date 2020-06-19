const RequestError = require('./models/RequestError');
const DynamoController = require('./controller/DynamoController');
const Response = require('./models/Response');
const LoggingHelper = require('./utils/LoggingHelper');
const ResponseHelper = require('./utils/ResponseHelper');
const User = require('./models/User');
const moment = require('moment');

const ResourcesEnum = {
    RETRIEVE_USER: "/getUserById",
    CHECK_SUBSCRIBER: "/checkSubscriberById",
    UPDATE_SUBSCRIBER: '/updateSubscriber',
    GET_PURCHASES: '/getPurchases',
    ADD_NEW_USER: '/addNewUser',
    GET_USER_TOOLS: '/getUserTools',
    ADD_NEW_USER_TOOL: '/addNewUserTool',
    ADD_SKIN_TONE: '/addSkinTone',
    ADD_EYE_SHAPE: '/addEyeShape',
    UPDATE_USAGE_COUNT: '/updateUsageCount',
    USER_LOGIN: '/userLogin'
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
                const userId = event.queryStringParameters.userId;

                // Get a new instance of the database controller and then add a new user.
                const response = await DynamoController.getInstance(loggingHelper).checkSubscriber(userId);

                return responseHelper.getSuccessfulResponse(
                    new Response(HttpCodesEnum.OK, JSON.stringify(response))
                );

            } catch (err) {
                // return an error if anythin in the try block fails
                return responseHelper.getErrorResponse(err);
            }

            break;
            // Get purchases for user Id
        case ResourcesEnum.GET_PURCHASES:

            try {
                const userId = event.queryStringParameters.userId;

                // Get a new instance of the database controller and then add a new user.
                const response = await DynamoController.getInstance(loggingHelper).getPurchases(userId);

                return responseHelper.getSuccessfulResponse(
                    new Response(HttpCodesEnum.OK, JSON.stringify(response))
                );

            } catch (err) {
                // return an error if anythin in the try block fails
                return responseHelper.getErrorResponse(err);
            }

            break;

            //  Update the subscriber flag
        case ResourcesEnum.UPDATE_SUBSCRIBER:
            try {
                const request = JSON.parse(event.body);

                console.log('request = ', request);


                const userId = event.queryStringParameters.userId;

                // Get a new instance of the database controller and then add a new user.
                const response = await DynamoController.getInstance(loggingHelper).updateSubscriber(userId, request.subscriberFlag);

                return responseHelper.getSuccessfulResponse(
                    new Response(HttpCodesEnum.OK, JSON.stringify(response))
                );

            } catch (err) {
                // return an error if anythin in the try block fails
                return responseHelper.getErrorResponse(err);
            }

            break;


            // Add a new user
        case ResourcesEnum.ADD_NEW_USER:

            try {
                const request = JSON.parse(event.body);

                console.log('request = ', request);

                // Get a new instance of the database controller and then add a new user.
                const response = await DynamoController.getInstance(loggingHelper).addNewUser(request);

                return responseHelper.getSuccessfulResponse(
                    new Response(HttpCodesEnum.OK, JSON.stringify(response))
                );

            } catch (err) {
                // return an error if anythin in the try block fails
                return responseHelper.getErrorResponse(err);
            }

            break;

        case ResourcesEnum.GET_USER_TOOLS:

            try {
                const userId = event.queryStringParameters.userId;

                // Get a new instance of the database controller and then add a new user.
                const response = await DynamoController.getInstance(loggingHelper).getUserTools(userId);

                return responseHelper.getSuccessfulResponse(
                    new Response(HttpCodesEnum.OK, JSON.stringify(response))
                );

            } catch (err) {
                // return an error if anythin in the try block fails
                return responseHelper.getErrorResponse(err);
            }

            break;


        case ResourcesEnum.ADD_NEW_USER_TOOL:

            try {
                const userId = event.queryStringParameters.userId;
                const request = JSON.parse(event.body);

                // Get a new instance of the database controller and then add a new user.
                const response = await DynamoController.getInstance(loggingHelper).addNewUserTool(userId, request.toolId);

                return responseHelper.getSuccessfulResponse(
                    new Response(HttpCodesEnum.OK, JSON.stringify(response))
                );

            } catch (err) {
                // return an error if anythin in the try block fails
                return responseHelper.getErrorResponse(err);
            }

            break;


            // Add a new user
        case ResourcesEnum.ADD_SKIN_TONE:

            try {

                const userId = event.queryStringParameters.userId;
                const request = JSON.parse(event.body);

                console.log('request = ', request);

                // Get a new instance of the database controller and then add a new user.
                const response = await DynamoController.getInstance(loggingHelper).addSkinTone(userId, request.skinTone);

                return responseHelper.getSuccessfulResponse(
                    new Response(HttpCodesEnum.OK, JSON.stringify(response))
                );

            } catch (err) {
                // return an error if anythin in the try block fails
                return responseHelper.getErrorResponse(err);
            }

            break;


        case ResourcesEnum.ADD_EYE_SHAPE:

            try {

                const userId = event.queryStringParameters.userId;
                const request = JSON.parse(event.body);

                console.log('request = ', request);

                // Get a new instance of the database controller and then add a new user.
                const response = await DynamoController.getInstance(loggingHelper).addEyeShape(userId, request.eyeShape);

                return responseHelper.getSuccessfulResponse(
                    new Response(HttpCodesEnum.OK, JSON.stringify(response))
                );

            } catch (err) {
                // return an error if anythin in the try block fails
                return responseHelper.getErrorResponse(err);
            }

            break;

            // Update the usage count of the user
        case ResourcesEnum.UPDATE_USAGE_COUNT:

            try {

                const userId = event.queryStringParameters.userId;


                // Get a new instance of the database controller and update the usage count
                const response = await DynamoController.getInstance(loggingHelper).updateUsageCount(userId);

                return responseHelper.getSuccessfulResponse(
                    new Response(HttpCodesEnum.OK, JSON.stringify(response))
                );

            } catch (err) {
                // return an error if anythin in the try block fails
                return responseHelper.getErrorResponse(err);
            }

            break;

            /**
             * userLogin - login the user by increasing the usage coun and also 
             * the streak if needed
             */
        case ResourcesEnum.USER_LOGIN:

            try {

                const userId = event.queryStringParameters.userId;
                const request = JSON.parse(event.body);

                //The update streak
                let updateStreak = false;

                // Get the lastUsedTimeStamp from the database
                let lastUsedTimeStamp = await DynamoController.getInstance(loggingHelper).getLastUsedTimestamp(userId);

                if (lastUsedTimeStamp) {
                    lastUsedTimeStamp = lastUsedTimeStamp.rtnData.Items[0].lastUsedTimestamp;

                    // Calculate if we need to update the streak
                    var startDate = moment.utc(lastUsedTimeStamp);
                    var endDate = moment.utc(request.currentTimeStamp);

                    console.log('...difference = ', endDate.diff(startDate, 'days') );
                    

                    if (endDate.diff(startDate, 'days') === 1) {

                        // set the flag to update the streak
                        updateStreak = true;
                    }
                }

                // Get a new instance of the database controller and update the usage count
                const response = await DynamoController.getInstance(loggingHelper).userLogin(userId, updateStreak, request.currentTimeStamp);

                return responseHelper.getSuccessfulResponse(
                    new Response(HttpCodesEnum.OK, JSON.stringify(response))
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