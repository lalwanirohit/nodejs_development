import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateSuccessResponse, generateFailureResponse } from "../helpers/responseHelper.js";

class UserController {
    // First time when user will sign up then we will store data using following function
    static userRegistration = async(req, res) => {
        try {
            const { name, email, phone, password, confirmPassword, tc } = req.body;
            let success = false, message = "", data = {};

            if(!name || !email || !phone || !password || !confirmPassword || !tc) {
                return res.send(generateFailureResponse("Please provide all the required details."));
            }

            if(password !== confirmPassword) {
                return res.send(generateFailureResponse("Password and confirm password are not same."));
            }

            const existingUser = await userModel.findOne({email: email});
            if(existingUser) {
                return res.send(generateFailureResponse("User with provided email is already exist."));
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await userModel.create({
                    name: name,
                    email: email,
                    phone: phone,
                    password: hashedPassword,
                    tc: tc
                });

                // Generate JWT token
                const token = jwt.sign(
                    {userId: user._id},
                    process.env.JWT_SECRET_KEY,
                    {expiresIn: '1d'}
                );

                // set all response data
                success = true;
                message = "User registered successfully.";
                data = {
                    id: user._id,
                    email: user.email,
                    phone: user.phone,
                    token: token
                }
                return res.send(generateSuccessResponse(success, message, data));
            }
        } catch (error) {
            return res.send(generateFailureResponse(error.message));
        }
    }

    // When user will login then we will check user credentials by following function
    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            let success = false, message = "", data = {};

            if(!email || !password) {
                return res.send(generateFailureResponse("Please provide all the required details."));
            }

            const user = await userModel.findOne({email: email});
            if(!user) {
                return res.send(generateFailureResponse("You are not registered. Please register first."));
            } else {
                const isMatch = await bcrypt.compare(password, user.password);
                if(user.email === email && isMatch){
                    // Generate JWT token
                    const token = jwt.sign(
                        {userId: user._id},
                        process.env.JWT_SECRET_KEY,
                        {expiresIn: '1d'}
                    )

                    // set all response data
                    success = true;
                    message = "Logged in successfully.";
                    data = {
                        id: user._id,
                        email: user.email,
                        token: token
                    }
                    return res.send(generateSuccessResponse(success, message, data));
                } else {
                    return res.send(generateFailureResponse("Email & Password combination is not valid"));
                }
            }
        } catch (error) {
            return res.send(generateFailureResponse(error.message));
        }
    }

    // Existing user with current password want to switch the password then we will implement it using followig function
    static changePassword = async (req, res) => {
        try {
            let success = false, message = "", data = {};
            const { newPassword, confirmNewPassword } = req.body;
            if(!newPassword || !confirmNewPassword) {
                return res.send(generateFailureResponse("Please provide all the required details."));
            }

            if(newPassword !== confirmNewPassword) {
                return res.send(generateFailureResponse("Password and confirm password are not same."));
            }

            const newHashedPassword = await bcrypt.hash(newPassword, 10);
            console.log(req.user._id);
            await userModel.findByIdAndUpdate(req.user._id, {$set: {password: newHashedPassword}});

            // set all response data
            success = true;
            message = "Password changed successfully.";
            return res.send(generateSuccessResponse(success, message, data));
        } catch (error) {
            return res.send(generateFailureResponse(error.message));
        }
    }

    // Get all the user details for profile page by following function
    static loggedInUser = async (req, res) => {
        try {
            let success = false, message = "", data = {};

            // set all response data
            success = true;
            message = "Logged in user.";
            data = {
                id: req.user._id,
                email: req.user.email,
            }
            return res.send(generateSuccessResponse(success, message, data));
        } catch (error) {
            return res.send(generateFailureResponse(error.message));
        }
    }
}

export default UserController;