const AWS = require("aws-sdk");
const DocumentClient = require("aws-sdk/lib/dynamodb/document_client");

// Users
const USERS_TABLE = process.env.USERS_TABLE || "";
const USERS_INDEX = process.env.USERS_INDEX || "";

// Tools
const TOOLS_TABLE = process.env.TOOLS_TABLE || "";
const TOOLS_INDEX = process.env.TOOLS_INDEX || "";

const AIRTABLE_API_KEY = "key48NEUz9DnPFN90";

var Airtable = require('airtable');



module.exports = class DynamoDAO {
  constructor(pLoggingHelper) {
    this.dynamo = new AWS.DynamoDB.DocumentClient({
      apiVersion: '2012-08-10'
    });
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
      IndexName: USERS_INDEX,
      TableName: USERS_TABLE,
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
      IndexName: USERS_INDEX,
      TableName: USERS_TABLE,
      ProjectionExpression: "subscriberFlag",
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
      UpdateExpression: `SET subscriberFlag = :subscriber`,
      ExpressionAttributeValues: {
        ":subscriber": subscriberValue
      },
      ReturnValues: "UPDATED_NEW"
    };
    return this.dynamo.update(params).promise();
  };

  /**
   * addNewUserTool
   * @param {string} id 
   * @param {string} toolId 
   */
  async addNewUserTool(id, toolId) {
    this.loggingHelper.info("Update tool array for user ", id);

    // Get the current user details
    let params = {
      IndexName: USERS_INDEX,
      TableName: USERS_TABLE,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    };
    // Scan for the item in the user-id-index
    let response = await this.dynamo.query(params).promise();

    let toolsArray = response.Items[0].tools;

    toolsArray.push(toolId);

    // Update the user table with the new tool
    params = {
      TableName: USERS_TABLE,
      Key: {
        "id": id
      },
      UpdateExpression: "set tools = :newToolsArray",
      ExpressionAttributeValues: {
        ":newToolsArray": toolsArray
      },
      ReturnValues: "UPDATED_NEW"
    };

    response = await this.dynamo.update(params).promise();

    let lRtnJson = {
      tools: response.Attributes.tools,
      success: true
    };

    return lRtnJson;

  }; //addNewUserTool

  /**
   * getPurchases - Get the purchases of the user
   * @param {string} pUserId
   */
  async getPurchases(id) {
    this.loggingHelper.info("Get purchases for user", id);

    let params = {
      IndexName: USERS_INDEX,
      TableName: USERS_TABLE,
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

  /**
   * getUserTools that the user has
   * @param {string} userId 
   */
  async getUserTools(userId) {
    this.loggingHelper.info("Get tools for user = ", userId);

    let lToolsRtn = [];

    let toolItemRecord;

    var params = {
      IndexName: USERS_INDEX,
      TableName: USERS_TABLE,
      ProjectionExpression: "tools",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": userId
      }
    };
    // Scan for the item in the user-id-index
    let data = await this.dynamo.query(params).promise();

    var toolsObject = {};
    var index = 0;
    data.Items[0].tools.forEach(function (value) {
      index++;
      var toolKey = ":id" + index;
      toolsObject[toolKey.toString()] = value;
    });

    params = {
      TableName: TOOLS_TABLE,
      ProjectionExpression: "id, toolName, imageUrl, toolDescription",
      FilterExpression: "id IN (" + Object.keys(toolsObject).toString() + ")",
      ExpressionAttributeValues: toolsObject

    };

    data = await this.dynamo.scan(params).promise();

    return data.Items;
  }; // getUserTools


};



/**
 * getToolDetail 
 * Get the details of the tool from the tools airtable
 * @param {string} toolId 
 */
var getToolDetail = toolId => {

  let lRtnJson = {};
  var filterFormula = '({id} = \'' + toolId + '\')';

  const base = new Airtable({
    apiKey: 'key48NEUz9DnPFN90'
  }).base('appAG0QPlc2zZCxNN');

  return new Promise(async function (resolve, reject) {

    base('MAIN').select({
      filterByFormula: filterFormula,
      maxRecords: 1,
      view: "view"
    }).eachPage(function page(records, fetchNextPage) {

      records.forEach(function (record) {
        console.log('Retrieved', record.get('id'));
        lRtnJson = record;
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

    }, function done(err) {
      if (err) {
        console.log(err);
        reject(lRtnJson);
      } else {
        resolve(lRtnJson);
      }
    });

  }); // Promise


}; // getToolDetail