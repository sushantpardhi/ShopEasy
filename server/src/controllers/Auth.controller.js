import bcrypt from "bcrypt";
import Validation from "../Utils/Validation.js";
import TokenManager from "../Utils/TokenManager.js";
import userService from "../Services/User.service.js";
import cartService from "../Services/Cart.service.js";
import Response from "../Utils/Response.js";
import wishlistService from "../Services/Wishlist.service.js";
import EmailController from "./Email.controller.js";
import logger from "../Utils/logger.js";

class AuthController {
  verifyAuth = async (req, res) => {
    // If we reach here, it means the authMiddleware has already verified the token
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return Response.error(res, "User not found", {}, 404, "NOT_FOUND");
    }
    return Response.success(res, "User authenticated successfully", { user });
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    try {
      logger.info(`Login attempt for email: ${email}`);

      if (!Validation.isNotEmpty(email) || !Validation.isNotEmpty(password)) {
        logger.warn("Login attempt with empty credentials");
        return Response.error(
          res,
          "Email and password are required",
          {},
          400,
          "VALIDATION_ERROR"
        );
      }
      if (!Validation.isEmail(email)) {
        logger.warn(`Invalid email format attempted: ${email}`);
        return Response.error(
          res,
          "Invalid email format",
          {},
          400,
          "VALIDATION_ERROR"
        );
      }

      if (req.cookies.token) {
        logger.warn(`Already logged in attempt for email: ${email}`);
        return Response.error(
          res,
          "User already logged in",
          {},
          400,
          "ALREADY_LOGGED_IN"
        );
      }

      const user = await userService.getUserByEmail(email);
      if (!user) {
        logger.warn(`Login attempt with non-existent email: ${email}`);
        return Response.error(
          res,
          "Invalid email or password",
          {},
          401,
          "AUTH_ERROR"
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.warn(`Failed password attempt for email: ${email}`);
        return Response.error(
          res,
          "Invalid email or password",
          {},
          401,
          "AUTH_ERROR"
        );
      }

      const tokenExpirationMs = 24 * 60 * 60 * 1000; // 24 hours
      const cookieExpirationMs = 30 * 24 * 60 * 60 * 1000; // 30 days

      // Generate token with additional claims
      const userToken = TokenManager.generateToken(
        user._id.toString(),
        user.role.toString(),
        tokenExpirationMs,
        { email: user.email }
      );

      await TokenManager.storeInCookie(res, userToken, cookieExpirationMs);

      // Update last login timestamp
      user.lastLogin = new Date();
      await user.save();

      logger.info(`User logged in successfully: ${email}`);
      return Response.success(
        res,
        "User Logged In Successfully",
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          userToken: userToken,
        },
        200,
        "LOGIN_SUCCESS"
      );
    } catch (error) {
      logger.error(`Login error for email ${email}: ${error.message}`);
      return Response.error(
        res,
        "Login failed",
        {},
        500,
        "SERVER_ERROR",
        error.message
      );
    }
  };

  register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      logger.info(`Registration started for email: ${email}`);

      if (
        !Validation.isNotEmpty(name) ||
        !Validation.isNotEmpty(email) ||
        !Validation.isNotEmpty(password)
      ) {
        logger.warn("Registration attempt with empty fields");
        return Response.error(
          res,
          "All fields are required",
          {},
          400,
          "VALIDATION_ERROR"
        );
      }
      if (!Validation.isName(name)) {
        logger.warn(`Invalid name format attempted: ${name}`);
        return Response.error(
          res,
          "Name must contain only letters and spaces",
          {},
          400,
          "VALIDATION_ERROR"
        );
      }
      if (!Validation.isEmail(email)) {
        logger.warn(`Invalid email format attempted: ${email}`);
        return Response.error(
          res,
          "Invalid email format",
          {},
          400,
          "VALIDATION_ERROR"
        );
      }
      if (!Validation.passwordStrength(password)) {
        logger.warn(`Weak password attempt for email: ${email}`);
        return Response.error(
          res,
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
          {},
          400,
          "VALIDATION_ERROR"
        );
      }

      const existingUser = await userService.getUserByEmail(email);
      if (existingUser) {
        logger.warn(`Registration attempt with existing email: ${email}`);
        return Response.error(
          res,
          "User with this email already exists",
          {},
          400,
          "USER_EXISTS"
        );
      }

      const newUser = await userService.addUser(name, email, password);

      await cartService.createCart(newUser._id);
      await wishlistService.createWishlist(
        newUser._id,
        "My Wishlist",
        "Default wishlist"
      );

      await newUser.save();

      await EmailController.sendWelcomeEmail(res, newUser.email, newUser.name);

      logger.info(`Registration successful for ${newUser.email}`);
      return await Response.success(
        res,
        "User registered successfully",
        {
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
          },
        },
        201,
        "REGISTER_SUCCESS"
      );
    } catch (error) {
      logger.error(`Registration error: ${error}`);
      return Response.error(
        res,
        "Registration failed",
        {},
        500,
        "SERVER_ERROR",
        error.message
      );
    }
  };

  logout = async (req, res) => {
    try {
      logger.info(
        "Logout attempt",
        req.cookies.token ? `with token: ${req.cookies.token}` : "without token"
      );
      await TokenManager.clearCookie(res);

      logger.info("User logged out successfully");
      return Response.success(
        res,
        "User logged out successfully",
        {},
        200,
        "LOGOUT_SUCCESS"
      );
    } catch (error) {
      logger.error(`Logout failed: ${error.message}`);
      return Response.error(
        res,
        "Logout failed",
        {},
        500,
        "SERVER_ERROR",
        error.message
      );
    }
  };
}

export default new AuthController();