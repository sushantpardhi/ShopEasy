import mongoose from "mongoose";

class Validation {
    static isEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static isName(name){
        const re = /^[a-zA-Z\s]+$/;
        return re.test(name);
    }

    static passwordStrength(password) {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return re.test(password);
    }

    static isNotEmpty(value) {
        return value.trim().length > 0;
    }

    static isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

}

export default Validation;
