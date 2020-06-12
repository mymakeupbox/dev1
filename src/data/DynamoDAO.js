const AWS = require("aws-sdk");
const DocumentClient = require("aws-sdk/lib/dynamodb/document_client");

const USERS_TABLE = process.env.USERS_TABLE || "";

module.exports = class DynamoDAO {
  constructor(pLoggingHelper) {
    this.dynamo = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});;
    this.loggingHelper = pLoggingHelper;
  }

  /**
   * addItem
   * Add a new user to the user database table
   * @param {string} item
   */
  async addItem(item) {
    this.loggingHelper.info("Saving new item to DB", item);
    const params = {
      TableName: USERS_TABLE,
      Item: item,
      ConditionExpression: "attribute_not_exists( id )"
    };
    await this.dynamo.put(params).promise();
    return item;
  }

  /**
   * getUserById
   * Get the user record from the database keyed on id
   *
   */
  async getUserById(id) {
    this.loggingHelper.info("Getting user id", id);

    const params = {
      IndexName: "user-id-index",
      TableName: "user",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    };
    // Scan for the item in the user-id-index
    let response = await this.dynamo.query(params).promise();


    return response;
  }

  /**
   * checkSubscriberById
   * Get the user record from the database keyed on id
   * returns an
   */
  async checkSubscriberById(id) {
    this.loggingHelper.info("Getting subsciber flag", id);

    let params = {
      IndexName: "user-id-index",
      TableName: "user",
      ProjectionExpression: "subscriber",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    };
    // Scan for the item in the user-id-index
    let response = await this.dynamo.query(params).promise();

    return response.Items[0];
  }

  /**
   * updateSubscriber
   * Set the subscriber field to true or false
   * 
   */
  async updateSubscriber(id, subscriberValue) {
    this.loggingHelper.info("Update subscriber flag to ", subscriberValue);
    const params = {
      TableName: USERS_TABLE,
      Key: {
        id: id
      },
      UpdateExpression: `SET subscriber = :subscriber`,
      ExpressionAttributeValues: {
        ":subscriber": subscriberValue
      },
      ReturnValues: "UPDATED_NEW"
    };
    return this.dynamo.update(params).promise();
  }

  /**
   * getPurchases - Get the purchases of the user
   * @param {string} pUserId
   */
  async getPurchases(id) {
    this.loggingHelper.info("Get purchases for user", id);

    let params = {
      IndexName: "user-id-index",
      TableName: "user",
      ProjectionExpression: "purchases",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    };
    // Scan for the item in the user-id-index
    let response = await this.dynamo.query(params).promise();

    return response.Items[0].purchases;

  }; // getPurchases




};
