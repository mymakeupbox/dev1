const DynamoDAO = require('../../data/purchases/DynamoDAO');
const AWSService = require('../AWSService');

module.exports = class DynamoController {

    /**
     * getInstance - Get a new instance of the DynamoController class
     * @param {obj} loggingHelper 
     */
    static getInstance(loggingHelper) {
        if (!this.instance) {
            this.instance = new DynamoController(loggingHelper);
        }
        return this.instance;
    }

    constructor(loggingHelper) {
        this.loggingHelper = loggingHelper;
        this.dynamoDao = new DynamoDAO(this.loggingHelper);
        this.awsService = AWSService.getInstance(this.loggingHelper);
    }

    /**
     * addNewPurchase
     * Write a new purchase to the database table Purchases
     * @param {JSON Object} newPurchaseObj 
     */
    async addNewPurchase(newPurchaseObj) {
        this.loggingHelper.info('add new purchase for user', newPurchaseObj.userId);
        return this.dynamoDao.addNewPurchase(newPurchaseObj);
    }

    

}