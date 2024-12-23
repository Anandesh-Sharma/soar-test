const jwt        = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const md5        = require('md5');
const { User1 }  = require('./Users.Model');


module.exports = class TestingManager {

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.usersCollection     = "users";
        this.httpExposed         = ['createUser', 'get=testUser'];
    }

    async createUser({username, email, password}){
        const user = {username, email, password};

        // Data validation
        let result = await this.validators.user.createUser(user);
        if(result) return result;

        // push to database
        
        
        // Creation Logic
        let createdUser     = {username, email, password}
        console.log('createdUser', createdUser);
        console.log(createdUser.key);
        let longToken       = this.tokenManager.genLongToken({userId: createdUser._id, userKey: createdUser.key });
        user.token = longToken;
        let newUser = new User1(user);
        await newUser.save();
        // Response
        return {
            user: createdUser, 
            longToken 
        };
    }

    async testUser({__longToken, __rateLimit}){
        console.log(__longToken);
        console.log(__rateLimit);
        return "testUser";
    }
}