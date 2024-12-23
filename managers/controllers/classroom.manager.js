module.exports = class ClassroomManager { 

    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators; 
        this.mongomodels = mongomodels;
        this.tokenManager = managers.token;
        this.httpExposed = ['post=createClassroom', 'get=getClassrooms', 'get=getClassroom', 'patch=updateClassroom', 'delete=deleteClassroom'];
    }

    async createClassroom({ classroomName, capacity, resources, __rateLimit, __authSchoolAdmin, __query }) {
        const obj = { classroomName, capacity, resources };
        const { schoolId } = __query;

        let resultId = await this.validators.classroom.createClassroomId({ id: schoolId });
        if (resultId) return { code: 422, errors: resultId };
        // Data validation
        let result = await this.validators.classroom.createClassroom(obj);
        if (result) return { code: 422, errors: result };

        try {
            const school = await this.mongomodels.school.findById(schoolId);
            if (!school) return { code: 404, errors: 'School not found' };

            let createdClassroom = await this.mongomodels.classroom.create({ classroomName, capacity, resources, school: schoolId });
            return { code: 201, createdClassroom };
        } catch (error) {
            console.error('Error creating classroom:', error);
            return { code: 500, errors: 'Error creating classroom' };
        }
    }

    async getClassroom({ __authSchoolAdmin, __query }) {
        const { id, schoolId } = __query;

        // Validate input
        let result = await this.validators.classroom.getClassroom({ id });
        if (result) return { code: 422, errors: result };

        try {
            const school = await this.mongomodels.school.findById(schoolId);
            if (!school) return { code: 404, errors: 'School not found' };

            let classroom = await this.mongomodels.classroom.findOne({ _id: id, school: schoolId });
            if (!classroom) {
                return { code: 404, errors: 'Classroom not found' };
            }
            return { code: 200, classroom };
        } catch (error) {
            console.error('Error fetching classroom:', error);
            return { code: 500, errors: 'Error fetching classroom' };
        }
    }

    async getClassrooms({ __authSchoolAdmin, __query }) {
        const { schoolId, offset = '0', limit = '10' } = __query;

        let result = await this.validators.classroom.getClassrooms({ offset, limit });
        if (result) return { code: 422, errors: result };

        try {
            const school = await this.mongomodels.school.findById(schoolId);
            if (!school) return { code: 404, errors: 'School not found' };

            let classrooms = await this.mongomodels.classroom.find({school: schoolId})
                .populate('school', 'name')
                .skip(offset)
                .limit(limit);

            if (!classrooms || classrooms.length === 0) {
                return { code: 404, errors: 'No classrooms found' };
            }
            return { code: 200, classrooms };
        } catch (error) {
            console.error('Error fetching classrooms:', error);
            return { code: 500, errors: 'Error fetching classrooms' };
        }
    }

    async updateClassroom({ classroomName, capacity, resources, __rateLimit, __authSchoolAdmin, __query }) {
        const { schoolId, id } = __query;
        const updates = { classroomName, capacity, resources};

        //data validation
        let result = await this.validators.classroom.updateClassroom(updates);
        if (result) return { code: 422, errors: result };

        let resultId = await this.validators.classroom.createClassroomId({ id });
        if (resultId) return { code: 422, errors: resultId };

        try {
            const school = await this.mongomodels.school.findById(schoolId);
            if (!school) return { code: 404, errors: 'School not found' };

            let updatedClassroom = await this.mongomodels.classroom.findOneAndUpdate({_id: id, school: schoolId}, updates, { new: true });
            if (!updatedClassroom) {
                return { code: 404, errors: 'Classroom not found' };
            }
            return { code: 200, message: 'Classroom updated successfully' };
        } catch (error) {
            console.error('Error updating classroom:', error);
            return { code: 500, errors: 'Error updating classroom' };
        }
    }

    async deleteClassroom({ __rateLimit, __authSchoolAdmin, __query }) {
        const { schoolId, id } = __query;

        let result = await this.validators.classroom.deleteClassroom({ id });
        if (result) return { code: 422, errors: result };

        try {
            const school = await this.mongomodels.school.findById(schoolId);
            if (!school) return { code: 404, errors: 'School not found' };

            let deletedClassroom = await this.mongomodels.classroom.findOneAndDelete({_id: id, school: schoolId});
            if (!deletedClassroom) {
                return { code: 404, errors: 'Classroom not found' };
            }
            return { code: 200, message: 'Classroom deleted successfully' };
        } catch (error) {
            console.error('Error deleting classroom:', error);
            return { code: 500, errors: 'Error deleting classroom' };
        }
    }
};