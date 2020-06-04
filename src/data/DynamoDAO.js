const AWS = require('aws-sdk');
const moment = require('moment');
const DocumentClient = require('aws-sdk/lib/dynamodb/document_client');
const LoggingHelper  = require ('../utils/LoggingHelper');


const USERS_TABLE = process.env.USERS_TABLE || "";

export class DynamoDAO {

    constructor(loggingHelper) {
        this.dynamo = new AWS.DynamoDB.DocumentClient();
        this.loggingHelper = loggingHelper;
    }

    /**
     * addItem
     * Add a new user to the user database table
     * @param {string} item 
     */
    async addItem(item) {
        this.loggingHelper.info('Saving new item to DB', item);
        const params = { 
            TableName: USERS_TABLE, 
            Item: item,
            ConditionExpression: 'attribute_not_exists( id )'
        };
        await this.dynamo.put(params).promise();
        return item;
    }

    /**
     * getUser
     * Get the user record from the database keyed on id
     * returns an
     */
    async getUser(id) {
        this.loggingHelper.info('Getting user id', id);
        let lRtnItem = {};

        const params = {
            IndexName: 'user-id-index',
            TableName: DynamoDAO.USERS_TABLE,
            ExclusiveStartKey: undefined,
            FilterExpression: "id = :id",
            ExpressionAttributeValues: {
                ":id": id
            }
        };
        // Scan for the item in the user-id-index 
        let response = await this.dynamo.scan(params).promise();

        response.Items.forEach(function(item) {
            lRtnItem = item;
        });

        return lRtnItem;
    }

    /**
     * markAsSubscriber
     * Set the subscriber field to true for the 
     * item in question
     */
    async markAsSubscriber(item) {
        this.loggingHelper.info('Mark user as subscriber', item);
        const params = {
            TableName: DynamoDAO.USERS_TABLE,
            Key: {
                id: item.id
            },
            UpdateExpression: `SET subscriber = :subscriber`,
            ExpressionAttributeValues: {
                ':subscriber': true
            },
            ReturnValues: 'UPDATED_NEW'
        };
        return this.dynamo.update(params).promise()
    }

    /**
     * removeSubscriber
     * Set the subscriber field to false for the 
     * item in question
     */
    async removeSubscriber(item){
        this.loggingHelper.info('Remove user as subscriber', item);
        const params = {
            TableName: DynamoDAO.USERS_TABLE,
            Key: {
                id: item.id
            },
            UpdateExpression: `SET subscriber = :subscriber`,
            ExpressionAttributeValues: {
                ':subscriber': false
            },
            ReturnValues: 'UPDATED_NEW'
        };
        return this.dynamo.update(params).promise()
    }


    /**
     * getPurchases - Get the purchases of the user
     * @param {obj} pUserId 
     */
    async getPurchases(item) {
        this.loggingHelper.info('Get purchases for user', item);
        let lRtnJson;

        let docClient = new DynamoDB.DocumentClient();

        return new Promise(function (resolve, reject) {

                let query = {
                    TableName: "user",
                    ProjectionExpression: "ID",
                    KeyConditionExpression: "ID = :pUserId",
                    ExpressionAttributeValues: {
                        ":pUserId": item.id
                    }
                };

                console.log('> Query is ', query);

                docClient.query(query, function (err, data) {
                        if (err) {
                            let errorResponse = "Unable to query. Error:" + JSON.stringify(err, null, 2);
                            reject(new Error(errorResponse));
                        } else {

                            console.log("Query succeeded.", data);
                            if (data.Items.length !== 0) {
                                data.Items.forEach(function (rtnItem) {

                                    resolve(rtnItem.purchases);

                                });
                            }
                        }
                });

        }); // promise
    }

}
