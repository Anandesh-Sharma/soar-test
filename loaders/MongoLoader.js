const loader = require('./_common/fileLoader');

module.exports = class MongoLoader {
    constructor({ schemaExtension }){
        this.schemaExtension = schemaExtension
    }

    load(){
        /** load Mongo Models */
        const models = loader(`./managers/models/*.${this.schemaExtension}`);;
        return models
    }
}