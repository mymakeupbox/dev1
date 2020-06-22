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

    //----

    async checkSubscriber(id) {
        this.loggingHelper.info('Check if the user is subscribed', id);
        return this.dynamoDao.checkSubscriberById(id);

    }
    async getPurchases(id) {
        this.loggingHelper.info('get purchases by user id', id);
        return this.dynamoDao.getPurchases(id);

    }

    async getUserTools(id) {
        this.loggingHelper.info('get tools by user id', id);
        return this.dynamoDao.getUserTools(id);

    }

    // add a new user to the user table
    async addNewUser(item) {
        this.loggingHelper.info('Adding new user', item);
        return this.dynamoDao.addItem(item);
    }

    // Add new user tool
    async addNewUserTool(id, toolId) {
        this.loggingHelper.info('Adding new user tool', toolId);
        return this.dynamoDao.addNewUserTool(id, toolId);
    }

    // Set the user as a subscriber
    async updateSubscriber(id, subscriberValue) {
        this.loggingHelper.info('Changing user %s subscriber flag', id);
        this.loggingHelper.info('Subscriber flag = ', subscriberValue);

        return this.dynamoDao.updateSubscriber(id, subscriberValue);
    }

    // add a new skin tone
    async addSkinTone(id, skinTone) {
        this.loggingHelper.info('Adding new skin tone for user', id);
        return this.dynamoDao.addSkinTone(id, skinTone);
    }

    // add a new eye shape
    async addEyeShape(id, eyeShape) {
        this.loggingHelper.info('Adding new eye shapefor user', id);
        return this.dynamoDao.addEyeShape(id, eyeShape);
    }


    /**
     * updateUsageCount - Update the usage count in the visitCount field
     * @param {string} id 
     */
    async updateUsageCount(id) {
        this.loggingHelper.info('Update the usage count', id);
        return this.dynamoDao.updateUsageCount(id);
    }

    /*
     * userLogin - Update the visitCount and also update the streak count if needs be
     * @param {string} id 
     * @param {string} currentTimeStamp 
     */
    async userLogin(id, updateStreak, currentTimeStamp) {
        this.loggingHelper.info('User Login', id);
        return this.dynamoDao.userLogin(id, updateStreak, currentTimeStamp);
    }


    async getLastUsedTimestamp(id) {
        this.loggingHelper.info('User Login', id);
        return this.dynamoDao.getLastUsedTimestamp(id);
    }

}