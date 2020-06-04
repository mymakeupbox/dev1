const uuidv4 = require('uuidv4');

export class User {

    static parse(request) {
        request.id = uuidv4(); // generate a unique ID - This might change to be tehe device ID
        return new User(request);
    }

    constructor(data) {
        this.id       = data.id;
        this.timeZone = data.timeZone;
        this.skinTone = data.skinTone;
        this.visitCount = data.visitCount;
        this.subscriberFlag = data.subscriberFlag;
        this.points = data.points;
        this.streakCount = data.streakCount;
        try {
            this.purchases = await getPurchases(userId);
        } catch (error) {
            this.purchases = {};
        }
    }

    
}