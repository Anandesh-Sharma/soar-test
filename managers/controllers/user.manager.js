const bcrypt = require('bcrypt');

module.exports = class User { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.httpExposed         = ['post=createUser', 'post=loginUser'];
    }

    async createUser({username, email, password, role, __query, __authSuperAdmin}){
        // Extracting schoolId from query
        let {schoolId} = __query;

        const user = {username, email, password, role};
        
        // Data validation
        let result = await this.validators.user.createUser(user);
        if(result) return {code: 422, errors :result};
        
        if (role === 'school_admin') { 
            // check if schoolId exists
            if (!schoolId) return {code: 422, errors: 'schoolId is required for school_admin role'};
            let school = await this.mongomodels.school.findById(schoolId);
            if (!school) return {code: 422, errors: 'schoolId does not exist'};

        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        // create user in database
        try {
            let createdUser = await this.mongomodels.user.create({ ...user, schoolId });
            
            // Creation Logic
            let longToken       = this.tokenManager.genLongToken({userId: createdUser._id, role: role });
            
            // Response
            return {code: 201, token: longToken, userId: createdUser._id};

        } 
        catch(error){
            // console.log('Error:', error);
            if (error.code === 11000) return {code: 409, error: error.errmsg};
            console.error('Error creating user:', error);
            return {code: 500, errors: 'Error creating user'};
        }
    }

    async loginUser({ email, username, password }) {
        try {
            // Find the user by email
            const user = await this.mongomodels.user.findOne({$or: [{ email }, { username }]});
            if (!user) {
                return { code: 401, errors: 'Invalid email/username or password' };
            }

            // Compare the provided password with the stored hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { code: 401, errors: 'Invalid email/username or password' };
            }

            // Generate a JWT token
            const token = this.tokenManager.genLongToken({userId: user._id, role: user.role });

            return { code: 200, token, userId: user._id };
        } catch (error) {
            console.error('Error logging in user:', error);
            return { code: 500, errors: 'Error logging in user' };
        }
    }
}
