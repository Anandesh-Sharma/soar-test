module.exports = class SchoolManager { 

    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators; 
        this.mongomodels = mongomodels;
        this.tokenManager = managers.token;
        this.managers = managers;
        this.httpExposed = ['post=createSchool', 'get=getSchools', 'get=getSchool', 'patch=updateSchool', 'delete=deleteSchool'];
    }

    async createSchool({ name, address, contactEmail, contactPhone, __rateLimit, __authSuperAdmin }) {
        const school = { name, address, contactEmail, contactPhone };

        // Data validation
        let result = await this.validators.school.createSchool(school);
        if (result) return { code: 422, errors: result };

        // Creation Logic
        let createdSchool;
        try {
            createdSchool = await this.mongomodels.school.create(school);
        } catch (error) {
            // catching mongo based errors
            if (error.code === 11000) {
                return { code: 409, errors: 'School already exists' };
            }
            console.error('Error creating school:', error);
            return { code: 500, errors: 'Error creating school' };
        }
        const schoolId = createdSchool._id;
        // Response
        return { code: 201, schoolId};
    }

    async getSchool({ __authSuperAdmin, __query }) {
        const { id } = __query;

        // Validate input
        let result = await this.validators.school.getSchool({ id });
        if (result) return { code: 422, errors: result };

        let school;
        try {
            school = await this.mongomodels.school.findById(id);
            if (!school) {
                return { code: 404, errors: 'School not found' };
            }
        } catch (error) {
            console.error('Error fetching school:', error);
            return { code: 500, errors: 'Error fetching school' };
        }

        // Response
        return { code: 200, school };
    }

    async getSchools({ __authSuperAdmin, __query }) {
        const { offset = '0', limit = '10' } = __query;

        // Validate input
        let result = await this.validators.school.getSchools({ offset, limit });
        if (result) return { code: 422, errors: result };

        let schools;
        try {
            schools = await this.mongomodels.school.find()
                .skip(offset)
                .limit(limit);
            if (!schools || schools.length === 0) {
                return { code: 404, errors: 'No schools found' };
            }
        } catch (error) {
            console.error('Error fetching schools:', error);
            return { code: 500, errors: 'Error fetching schools' };
        }

        // Response
        return { code: 200,  schools };
    }
    
    async updateSchool({ name, address, contactEmail, contactPhone, __rateLimit, __authSuperAdmin, __query }) {
        const { id } = __query;
        const updates = { name, address, contactEmail, contactPhone };
        // Data validation
        let resultId = await this.validators.school.updateSchoolId({ id });
        console.log('resultId', resultId);
        if (resultId) return { code: 422, errors: resultId };

        // check if I can use pine, for this kinda validations
        if (Object.values(updates).every(value => value === undefined)) {
            return { code: 422, errors: 'At least one field must be provided' };
        }
        
        let updatedSchool;
        try {
            updatedSchool = await this.mongomodels.school.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedSchool) {
                return { code: 404, errors: 'School not found' };
            }
        } catch (error) {
            console.error('Error updating school:', error);
            return { code: 500, errors: 'Error updating school' };
        }

        // Response
        return { code: 200, message: 'School updated successfully' };
    }

    async deleteSchool({ __rateLimit, __authSuperAdmin, __query }) {
        const { id } = __query;
        // Validate input
        let result = await this.validators.school.deleteSchool({ id });
        if (result) return { code: 422, errors: result };

        let deletedSchool;
        try {
            deletedSchool = await this.mongomodels.school.findByIdAndDelete(id);
            if (!deletedSchool) {
                return { code: 404, errors: 'School not found' };
            }
        } catch (error) {
            console.error('Error deleting school:', error);
            return { code: 500, errors: 'Error deleting school' };
        }

        // Response
        return { code: 200, message: 'School deleted successfully' };
    }
};