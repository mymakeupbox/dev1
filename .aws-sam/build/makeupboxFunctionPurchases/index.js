const RequestError = require("./models/RequestError");
const USER_DYNAMO_CONTROLLER = require("./controller/user/DynamoController");
const PURCHASES_DYNAMO_CONTROLLER = require("./controller/purchases/DynamoController");
const INTERACTION_HISTORY_DYNAMO_CONTROLLER = require("./controller/interactionHistory/DynamoController");
const Response = require("./models/Response");
const LoggingHelper = require("./utils/LoggingHelper");
const ResponseHelper = require("./utils/ResponseHelper");
const User = require("./models/User");
const moment = require("moment");

const ResourcesEnum = {
  USER: {
    RETRIEVE_USER: "/user/getUserById",
    CHECK_SUBSCRIBER: "/user/checkSubscriberById",
    UPDATE_SUBSCRIBER: "/user/updateSubscriber",
    GET_PURCHASES: "/user/getPurchases",
    ADD_NEW_USER: "/user/addNewUser",
    GET_USER_TOOLS: "/user/getUserTools",
    ADD_NEW_USER_TOOL: "/user/addNewUserTool",
    ADD_SKIN_TONE: "/user/addSkinTone",
    ADD_EYE_SHAPE: "/user/addEyeShape",
    UPDATE_USAGE_COUNT: "/user/updateUsageCount",
    USER_LOGIN: "/user/userLogin"
  },
  PURCHASES: {
    ADD_NEW_PURCHASE: "/purchases/addNewPurchase"
  },
  INTERACTION_HISTORY: {
    ADD_NEW_INTERACTION: "/interaction/addNewInteraction",
    GET_INTERACTIONS_BY_ID: "/interaction/getInteractionsByUserId"
  }
};

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

  loggingHelper.info("Handler event", event);

  // Create an instance of the reponse helper object
  const responseHelper = new ResponseHelper(event, loggingHelper);

  // based on the resource i.e. /retrieveUser do some logic
  switch (event.path) {
    // add a new interaction record to the table
    case ResourcesEnum.INTERACTION_HISTORY.ADD_NEW_INTERACTION:

      try {
        const request = JSON.parse(event.body);

        // Get a new instance of the database controller and call the add new interaction handler.
        const response = await INTERACTION_HISTORY_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).addNewInteraction(request);

        return responseHelper.getSuccessfulResponse(
          new Response(HttpCodesEnum.OK, JSON.stringify(response))
        );
      } catch (err) {
        // return an error if anythin in the try block fails
        return responseHelper.getErrorResponse(err);
      }

      break;

      /**
       * Get interactions by user id filtered on event type
       */
      case ResourcesEnum.INTERACTION_HISTORY.GET_INTERACTIONS_BY_ID:

      try {
        const userId = event.queryStringParameters.userId;
        const eventType = event.queryStringParameters.eventType;
        console.log('..........');
        console.log(userId);
        console.log(eventType);
        
        
        
        

        // Get a new instance of the database controller and call the add new interaction handler.
        const response = await INTERACTION_HISTORY_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).getInteractionsByUserId(userId,eventType);

        return responseHelper.getSuccessfulResponse(
          new Response(HttpCodesEnum.OK, JSON.stringify(response))
        );
      } catch (err) {
        // return an error if anythin in the try block fails
        return responseHelper.getErrorResponse(err);
      }

      break;

    // Add new purchase
    case ResourcesEnum.PURCHASES.ADD_NEW_PURCHASE:
      try {
        const request = JSON.parse(event.body);

        // Get a new instance of the database controller and then add a new user.
        const response = await PURCHASES_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).addNewPurchase(request);
        return responseHelper.getSuccessfulResponse(
          new Response(HttpCodesEnum.OK, JSON.stringify(response))
        );
      } catch (err) {
        // return an error if anythin in the try block fails
        return responseHelper.getErrorResponse(err);
      }

      break;

    // process the API call to /retrieveUser
    case ResourcesEnum.USER.RETRIEVE_USER:
      try {
        const userId = event.queryStringParameters.userId;

        // Get a new instance of the database controller and then add a new user.
        const response = await USER_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).getUserById(userId);
        return responseHelper.getSuccessfulResponse(
          new Response(HttpCodesEnum.OK, JSON.stringify(response))
        );
      } catch (err) {
        // return an error if anythin in the try block fails
        return responseHelper.getErrorResponse(err);
      }

      break;
    // Check if the user is subscribe or not
    case ResourcesEnum.USER.CHECK_SUBSCRIBER:
      try {
        const userId = event.queryStringParameters.userId;

        // Get a new instance of the database controller and then add a new user.
        const response = await USER_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).checkSubscriber(userId);

        return responseHelper.getSuccessfulResponse(
          new Response(HttpCodesEnum.OK, JSON.stringify(response))
        );
      } catch (err) {
        // return an error if anythin in the try block fails
        return responseHelper.getErrorResponse(err);
      }

      break;
    // Get purchases for user Id
    case ResourcesEnum.USER.GET_PURCHASES:
      try {
        const userId = event.queryStringParameters.userId;

        // Get a new instance of the database controller and then add a new user.
        const response = await USER_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).getPurchases(userId);

        return responseHelper.getSuccessfulResponse(
          new Response(HttpCodesEnum.OK, JSON.stringify(response))
        );
      } catch (err) {
        // return an error if anythin in the try block fails
        return responseHelper.getErrorResponse(err);
      }

      break;

    //  Update the subscriber flag
    case ResourcesEnum.USER.UPDATE_SUBSCRIBER:
      try {
        const request = JSON.parse(event.body);

        console.log("request = ", request);

        const userId = event.queryStringParameters.userId;

        // Get a new instance of the database controller and then add a new user.
        const response = await USER_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).updateSubscriber(userId, request.subscriberFlag);

        return responseHelper.getSuccessfulResponse(
          new Response(HttpCodesEnum.OK, JSON.stringify(response))
        );
      } catch (err) {
        // return an error if anythin in the try block fails
        return responseHelper.getErrorResponse(err);
      }

      break;

    // Add a new user
    case ResourcesEnum.USER.ADD_NEW_USER:
      try {
        const request = JSON.parse(event.body);

        console.log("request = ", request);

        // Get a new instance of the database controller and then add a new user.
        const response = await USER_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).addNewUser(request);

        return responseHelper.getSuccessfulResponse(
          new Response(HttpCodesEnum.OK, JSON.stringify(response))
        );
      } catch (err) {
        // return an error if anythin in the try block fails
        return responseHelper.getErrorResponse(err);
      }

      break;

    case ResourcesEnum.USER.GET_USER_TOOLS:
      try {
        const userId = event.queryStringParameters.userId;

        // Get a new instance of the database controller and then add a new user.
        const response = await USER_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).getUserTools(userId);

        return responseHelper.getSuccessfulResponse(
          new Response(HttpCodesEnum.OK, JSON.stringify(response))
        );
      } catch (err) {
        // return an error if anythin in the try block fails
        return responseHelper.getErrorResponse(err);
      }

      break;

    case ResourcesEnum.USER.ADD_NEW_USER_TOOL:
      try {
        const userId = event.queryStringParameters.userId;
        const request = JSON.parse(event.body);

        // Get a new instance of the database controller and then add a new user.
        const response = await USER_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).addNewUserTool(userId, request.toolId);

        return responseHelper.getSuccessfulResponse(
          new Response(HttpCodesEnum.OK, JSON.stringify(response))
        );
      } catch (err) {
        // return an error if anythin in the try block fails
        return responseHelper.getErrorResponse(err);
      }

      break;

    // Add a new user
    case ResourcesEnum.USER.ADD_SKIN_TONE:
      try {
        const userId = event.queryStringParameters.userId;
        const request = JSON.parse(event.body);

        console.log("request = ", request);

        // Get a new instance of the database controller and then add a new user.
        const response = await USER_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).addSkinTone(userId, request.skinTone);

        return responseHelper.getSuccessfulResponse(
          new Response(HttpCodesEnum.OK, JSON.stringify(response))
        );
      } catch (err) {
        // return an error if anythin in the try block fails
        return responseHelper.getErrorResponse(err);
      }

      break;

    case ResourcesEnum.USER.ADD_EYE_SHAPE:
      try {
        const userId = event.queryStringParameters.userId;
        const request = JSON.parse(event.body);

        console.log("request = ", request);

        // Get a new instance of the database controller and then add a new user.
        const response = await USER_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).addEyeShape(userId, request.eyeShape);

        return responseHelper.getSuccessfulResponse(
          new Response(HttpCodesEnum.OK, JSON.stringify(response))
        );
      } catch (err) {
        // return an error if anythin in the try block fails
        return responseHelper.getErrorResponse(err);
      }

      break;

    // Update the usage count of the user
    case ResourcesEnum.USER.UPDATE_USAGE_COUNT:
      try {
        const userId = event.queryStringParameters.userId;

        // Get a new instance of the database controller and update the usage count
        const response = await USER_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).updateUsageCount(userId);

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
    case ResourcesEnum.USER.USER_LOGIN:
      try {
        const userId = event.queryStringParameters.userId;
        const request = JSON.parse(event.body);

        //The update streak
        let updateStreak = false;

        // Get the lastUsedTimeStamp from the database
        let lastUsedTimeStamp = await USER_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).getLastUsedTimestamp(userId);

        if (lastUsedTimeStamp) {
          lastUsedTimeStamp =
            lastUsedTimeStamp.rtnData.Items[0].lastUsedTimestamp;

          // Calculate if we need to update the streak
          var startDate = moment.utc(lastUsedTimeStamp);
          var endDate = moment.utc(request.currentTimeStamp);

          console.log("...difference = ", endDate.diff(startDate, "days"));

          if (endDate.diff(startDate, "days") === 1) {
            // set the flag to update the streak
            updateStreak = true;
          }
        }

        // Get a new instance of the database controller and update the usage count
        const response = await USER_DYNAMO_CONTROLLER.getInstance(
          loggingHelper
        ).userLogin(userId, updateStreak, request.currentTimeStamp);

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
  const error = new RequestError(
    HttpCodesEnum.BAD_REQUEST,
    `Resource doesn't exist - ${JSON.stringify(event.resource)}`,
    {}
  );
  return responseHelper.getErrorResponse(error);
};
