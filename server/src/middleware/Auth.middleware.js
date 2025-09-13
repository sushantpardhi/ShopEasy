import Response from "../Utils/Response.js";
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return Response.error(res, "Unauthorized", {}, 401, "UNAUTHORIZED");

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
      // Clear the invalid/expired token cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return Response.error(
        res,
        "Invalid or expired token",
        {},
        401,
        "UNAUTHORIZED",
        err.message
      );
    }
};
