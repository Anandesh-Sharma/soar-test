module.exports = class StudentManager { 

    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators; 
        this.mongomodels = mongomodels;
        this.tokenManager = managers.token;
        this.managers = managers;
        this.httpExposed = ['post=createStudent', 'get=getStudents', 'get=getStudent', 'patch=updateStudent', 'delete=deleteStudent'];
    }

    async createStudent({ name, age, __rateLimit, __authSchoolAdmin, __query }) {
        try {
            const { schoolId, classroomId} = __query;
            // data validations
            let result = await this.validators.student.createStudent({ name, age, classroomId });
            if (result) return { code: 422, errors: result };

            try {
                const classroom = await this.mongomodels.classroom.findOne({ _id: classroomId, school: schoolId });
                if (!classroom) return { code: 400, errors: 'Invalid classroom for this school' };

                const student = await this.mongomodels.student.create({ name, age, school: schoolId, classroom: classroomId });
                return { code: 201, student };

            }catch(error){
                return { code: 500, errors: 'Error creating student' };
            }
        } catch (error) {
            console.error('Error creating student:', error);
            return { code: 500, errors: 'Error creating student' };
        }
    }

    async getStudents({ __authSchoolAdmin, __query }) {
        const { schoolId, offset = '0', limit = '10' } = __query;

        // Validate input
        let result = await this.validators.student.getStudents({ schoolId, offset, limit });
        if (result) return { code: 422, errors: result };
        
        try {
            const school = await this.mongomodels.school.findById(schoolId);
            if (!school) return { code: 404, errors: 'School not found' };

            const students = await this.mongomodels.student.find({ school: schoolId })
                            .populate('classroom', 'classroomName')
                            .populate('school', 'name')
                            .skip(offset)
                            .limit(limit)
                            .select('-__v -createdAt -updatedAt');
            return { code: 200, students };
        } catch (error) {
            console.error('Error fetching students:', error);
            return { code: 500, errors: 'Error fetching students' };
        }
    }

    async getStudent({ __authSchoolAdmin, __query }) {
        const { schoolId, id } = __query;
        // Validate input
        let result = await this.validators.student.getStudent({ schoolId, id });
        if (result) return { code: 422, errors: result };

        try {
            const school = await this.mongomodels.school.findById(schoolId);
            if (!school) return { code: 404, errors: 'School not found' };

            const student = await this.mongomodels.student
                            .findOne({ _id: id, school: schoolId })
                            .populate('classroom', 'classroomName')
                            .populate('school', 'name')
                            .select('-__v -createdAt -updatedAt');;
            if (!student) return { code: 404, errors: 'Student not found' };
            return { code: 200, student };
        } catch (error) {
            console.error('Error fetching student:', error);
            return { code: 500, errors: 'Error fetching student' };
        }
    }

    async updateStudent({ name, age, school, classroom, __rateLimit, __authSchoolAdmin, __query }) {
        const { schoolId, studentId, classroomId } = __query;
        const updateData = { name, age, school, classroom };
    
        let result = await this.validators.student.updateStudent({ schoolId, studentId, classroomId, name, age });
        if (result) return { code: 422, errors: result };

        try {
            const classroom = await this.mongomodels.classroom.findOne({ _id: classroomId, school: schoolId });
            if (!classroom) return { code: 400, errors: 'Invalid classroom for this school' };

            const student = await this.mongomodels.student.findOneAndUpdate(
                { _id: studentId, school: schoolId, classroom: classroomId },
                updateData,
                { new: true }
            );
            if (!student) return { code: 404, errors: 'Student not found' };
            return { code: 200, message: 'Student updated successfully' };
        } catch (error) {
            console.error('Error updating student:', error);
            return { code: 500, errors: 'Error updating student' };
        }
    }

    async deleteStudent({ __rateLimit, __authSchoolAdmin, __query }) {
        const { schoolId, id } = __query;
        // Validate input
        let result = await this.validators.student.deleteStudent({ schoolId, id });
        if (result) return { code: 422, errors: result };

        try {
            const student = await this.mongomodels.student.findOneAndDelete({ _id: id, school: schoolId });
            if (!student) return { code: 404, errors: 'Student not found' };
            return { code: 200, message: 'Student deleted' };
        } catch (error) {
            console.error('Error deleting student:', error);
            return { code: 500, errors: 'Error deleting student' };
        }
    }
};