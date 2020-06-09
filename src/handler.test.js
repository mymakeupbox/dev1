const handler = require('./handler');
const APIGatewayEvent = require('aws-lambda').APIGatewayEvent;
const User = require('./models/User');
const DynamoController = require('./controller/DynamoController');
const RequestError = require('./models/RequestError');
const createEvent = require('aws-event-mocks');


jest.mock('./utils/LoggingHelper');


const mockDynamoController = mock({
    addNewUser: jest.fn().mockResolvedValue([]),
    getUserById: async (id) => {
        if (id === 'abc') {
            return new User({ 
                id: "abc",
                timeZone: "America/New York",
                skinTone: 1,
                visitCount: 2,
                subscriberFlag: true,
                points: 400,
                streakCount: 2
            });
        }
        throw new RequestError(500, "boom", {});
    }
});

jest.mock('./controller/DynamoController', () => {
    return {
        DynamoController: jest.fn(() => mockDynamoController)
    }
});

const user = `[{
    "timeZone": "America/New York",
    "skinTone": 1,
    "visitCount": 2,
    "subscriberFlag": true,
    "points": 400,
    "streakCount": 2
}]`;

describe('User data service', () => {

    test('should create a valid user', async () => {
        const event = createEvent({
            template: 'aws:apiGateway',
            merge: {
              body: {}
            }
          });
        event.resource = ResourcesEnum.CREATE_SUBJECT;
        event.body = user;

        const result = await handler(event);
        expect(result).toHaveProperty('statusCode', 201);
    })

});
