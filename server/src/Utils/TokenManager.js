import jwt from "jsonwebtoken";
import logger from "./logger.js";

class TokenManager {
    static generateToken(userId, role, timeInMs) {

        try {
            const expiresInSeconds = Math.floor(timeInMs / 1000);

            const token = jwt.sign({id: userId, role: role}, process.env.JWT_SECRET, {
                expiresIn: expiresInSeconds,
            });

            logger.info(`Token generated: ${token}`);
            return token;
        } catch (error) {
            logger.error(`Token error: ${error}`);
        }
    }

    static async storeInCookie(res, token, timeInMs) {
        try {
            await res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: timeInMs,
                path: "/",
            });
            logger.info("Token stored in cookie");
        } catch (error) {
            logger.error(`Cookie error: ${error} `)
        }
    }

    static async clearCookie(res) {
        try {
            await res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
            });
            logger.info("Cookie Cleared")
        } catch (error) {
            logger.error(`Cookie error: ${error}`)
        }
    }
}

export default TokenManager;
