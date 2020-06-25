const DocumentClient = require("aws-sdk").DynamoDB.DocumentClient;
var randomstring = require("randomstring");

// Users
const INTERACTION_TABLE = process.env.INTERACTION_TABLE || "";
const INTERACTION_INDEX = process.env.INTERACTION_INDEX || "";

module.exports = class DynamoDAO {

  constructor(pLoggingHelper) {
    this.dynamo = new DocumentClient({
      apiVersion: '2012-08-10'
    });
    this.loggingHelper = pLoggingHelper;
  }

  /**
   * addNewInteraction
   * Add a interaction record to the table
   * @param {string} item
   */
  async addNewInteraction(item) {
    this.loggingHelper.info("Saving new interaction to DB", item);

    // Create a new random number 
    let id = randomstring.generate(12);

    // create a new id field in the json object
    item.id = id;

    const params = {
      TableName: INTERACTION_TABLE,
      Item: item,
      ConditionExpression: "attribute_not_exists( id )"
    };
    await this.dynamo.put(params).promise();
    return item;
  }

  /**
   * getInteractionsByUserId
   * Get interactions using the user id
   * @param {string} userId 
   * @param {string} eventType
   */
  async getInteractionsByUserId(userId, eventType) {
    this.loggingHelper.info("Get user interactions using user id ", userId);
    console.log('userId = ', userId);
    console.log('eventType = ', eventType);


    const params = {
      IndexName: INTERACTION_INDEX,
      TableName: INTERACTION_TABLE,
      KeyConditionExpression: "userId = :userId",
      FilterExpression: "eventType = :eventType",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":eventType": eventType
      }
    };
    // Scan for the item in the user-id-index
    let response = await this.dynamo.query(params).promise();

    return response;
  }

};