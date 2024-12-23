module.exports = {
    'username': (data)=>{
        if(data.trim().length < 3){
            return false;
        }
        return true;
    },
    'intFromString': (value) => {
        const intValue = parseInt(value, 10);
        if (isNaN(intValue)) {
            throw new Error('Invalid integer value');
        }
        return intValue;
    },
    'notEmptyUpdate': (value) => {
        console.log(value);
        if (value === undefined) {
            throw new Error('At least one field must be provided');
        }
        return value;
    },
}