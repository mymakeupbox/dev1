"use strict";

const DynamoDB = require('aws-sdk/clients/dynamodb');

class User {
    constructor(userId) {

        return (async () => {
            this.id = userId;
            try {
                await getUserDetails
            } catch (error) {
                
            }
            this.timeZone = timeZone;
            this.skinTone = skinTone;
            this.visitCount = visitCount;
            this.subscriberFlag = subscriberFlag;
            this.points = points;
            this.streakCount = streakCount;
            try {
                this.purchases = await getPurchases(userId);
            } catch (error) {
                this.purchases = {};
            }
            
            return this;
        })();

    } // constructor

    async 

    async getPurchases(pUserId) {

        let lRtnJson;

        let docClient = new DynamoDB.DocumentClient();

        return new Promise(function (resolve, reject) {

                let query = {
                    TableName: "user",
                    ProjectionExpression: "ID",
                    KeyConditionExpression: "ID = :pUserId",
                    ExpressionAttributeValues: {
                        ":pUserId": pUserId
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
                                data.Items.forEach(function (item) {

                                    resolve(item.purchases);

                                });
                            }
                        }
                });

        }); // promise
    }
} // user class