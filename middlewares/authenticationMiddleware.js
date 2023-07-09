import jwt from "jsonwebtoken";
import userModel  from "../models/User.js";
import { generateFailureResponse } from "../helpers/responseHelper.js";

export const isUserAuthenticated = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    if(authorization && authorization.startsWith("Bearer")){
        try {
            // get token from header
            token = authorization.split(" ")[1];

            // verify token
            const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            req.user = await userModel.findById(userId).select("-password");
            console.log(req.user);
            next();
        } catch (error) {
            return res.send(generateFailureResponse("Something went wrong!"));
        }
    } else {
        return res.send(generateFailureResponse("Token is either expired or unavailable."));
    }
}