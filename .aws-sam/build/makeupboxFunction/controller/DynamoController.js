const DynamoDAO = require('../data/DynamoDAO');
const AWSService = require('./AWSService');

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

    async getUserById(id) {
        this.loggingHelper.info('Getting user details by id', id);
        return this.dynamoDao.getUserById(id);
    }

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
}