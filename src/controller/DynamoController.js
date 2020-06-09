const DynamoDAO = require('../data/DynamoDAO');
const AWSService = require('./AWSService');
const LoggingHelper = require('../utils/LoggingHelper');



module.exports = class DynamoController {

    constructor(loggingHelper) {
        this.loggingHelper = loggingHelper;
        this.dynamoDao = new DynamoDAO(loggingHelper);
        this.awsService = AWSService.getInstance(loggingHelper);
    }

    getInstance(loggingHelper) {
        if (!this.instance) {
            this.instance = new DynamoController(loggingHelper);
        }
        return this.instance;
    }

    // add a new user to the user table
    async addNewUser(item) {
        this.loggingHelper.info('Adding new user', item);
        return this.dynamoDao.addItem(item);
    }

    // Set the user as a subscriber
    async setUserAsASubscriber(item){
        this.loggingHelper.info('Changing user %s to a subscriber', item.id);
        return this.dynamoDao.markAsSubscriber(item);
    }
}