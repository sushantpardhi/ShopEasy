import UserModel from "../models/User.model.js";
import bcrypt from "bcrypt";

class UserService {
    addUser = async (name, email, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);

        return new UserModel({
            name,
            email,
            password: hashedPassword,
        });
    }

    getAllUsers = async () => {
        return UserModel.find({}).select("-password");
    }

    getUserById = async (userId) => {
        return UserModel.findById(userId).select("-password");
    }

    updateUser = async (userId, updateData) => {
        return UserModel.findByIdAndUpdate(
            userId,
            updateData,
            {new: true}
        ).select("-password");
    }

    deleteUser = async (userId) => {
        return UserModel.findByIdAndDelete(userId);
    }

    getUserByEmail = async (email) => {
        return UserModel.findOne({email});
    }

}

export default new UserService();
