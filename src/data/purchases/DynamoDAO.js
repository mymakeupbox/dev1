const DocumentClient = require("aws-sdk").DynamoDB.DocumentClient;
var randomstring = require("randomstring");
//const DocumentClient = require("aws-sdk/lib/dynamodb/document_client");

// Users
const PURCHASES_TABLE = process.env.PURCHASES_TABLE || "";
const PURCHASES_INDEX = process.env.PURCHASES_INDEX || "";

// Tools
const TOOLS_TABLE = process.env.TOOLS_TABLE || "";
const TOOLS_INDEX = process.env.TOOLS_INDEX || "";




module.exports = class DynamoDAO {
  constructor(pLoggingHelper) {
    this.dynamo = new DocumentClient({
      apiVersion: '2012-08-10'
    });
    this.loggingHelper = pLoggingHelper;
  }

  /**
   * addNewPurchase - put a new object into the database
   * @param {JSON OBJ} newPurchaseObj 
   */
  async addNewPurchase(item){
    this.loggingHelper.info("Saving new purchase to DB", item);

     // Create a new random number 
     let id = randomstring.generate(12);

     // create a new id field in the json object
     item.ID = id;

    const params = {
      TableName: PURCHASES_TABLE,
      Item: item,
      ConditionExpression: "attribute_not_exists( id )"
    };
    await this.dynamo.put(params).promise();

    let lRtnJson = {
      Item: item,
      success: true
    }

    console.log(lRtnJson);

    return lRtnJson;

  };


};

