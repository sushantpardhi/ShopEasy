import { describe, it, expect, vi, beforeEach } from "vitest";
import AuthController from "../../src/controllers/Auth.controller.js";
import userService from "../../src/Services/User.service.js";
import TokenManager from "../../src/Utils/TokenManager.js";
import bcrypt from "bcrypt";
import Validation from "../../src/Utils/Validation.js";
import cartService from "../../src/Services/Cart.service.js";
import wishlistService from "../../src/Services/Wishlist.service.js";
import EmailController from "../../src/controllers/Email.controller.js";

// Mocked Express response object
const mockRes = () => {
    const res = {};
    res.cookie = vi.fn().mockReturnValue(res);
    res.clearCookie = vi.fn().mockReturnValue(res);
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

// Mocks
vi.mock("../../src/Services/User.service.js");
vi.mock("../../src/Utils/TokenManager.js");
vi.mock("bcrypt");
vi.mock("../../src/Utils/Validation.js");
vi.mock("../../src/Services/Cart.service.js");
vi.mock("../../src/Services/Wishlist.service.js");
vi.mock("../../src/controllers/Email.controller.js");

describe("AuthController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ------------------ LOGIN ------------------
    describe("login", () => {
        it("should return 400 if email or password is missing", async () => {
            const req = { body: { email: "", password: "" } };
            const res = mockRes();

            Validation.isNotEmpty.mockImplementation((val) => Boolean(val));

            await AuthController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    status: 400,
                    code: "VALIDATION_ERROR",
                    message: "Email and password are required",
                })
            );
        });

        it("should return 400 if email format is invalid", async () => {
            const req = { body: { email: "invalidemail", password: "123456" } };
            const res = mockRes();

            Validation.isNotEmpty.mockReturnValue(true);
            Validation.isEmail.mockReturnValue(false);

            await AuthController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 400,
                    code: "VALIDATION_ERROR",
                    message: "Invalid email format",
                })
            );
        });

        it("should return 401 if user not found", async () => {
            const req = { body: { email: "test@example.com", password: "123456" } };
            const res = mockRes();

            Validation.isNotEmpty.mockReturnValue(true);
            Validation.isEmail.mockReturnValue(true);
            userService.getUserByEmail.mockResolvedValue(null);

            await AuthController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 401,
                    code: "AUTH_ERROR",
                    message: "Invalid email or password",
                })
            );
        });

        it("should return 401 if password does not match", async () => {
            const req = { body: { email: "test@example.com", password: "wrongpass" } };
            const res = mockRes();

            Validation.isNotEmpty.mockReturnValue(true);
            Validation.isEmail.mockReturnValue(true);
            userService.getUserByEmail.mockResolvedValue({
                _id: "123",
                email: "test@example.com",
                password: "hashedpass",
            });
            bcrypt.compare.mockResolvedValue(false);

            await AuthController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 401,
                    code: "AUTH_ERROR",
                    message: "Invalid email or password",
                })
            );
        });

        it("should return 200 and set cookie if login is successful", async () => {
            const req = {
                body: { email: "test@example.com", password: "correctpass" },
            };
            const res = mockRes();

            Validation.isNotEmpty.mockReturnValue(true);
            Validation.isEmail.mockReturnValue(true);
            userService.getUserByEmail.mockResolvedValue({
                _id: "user123",
                email: "test@example.com",
                password: "hashedpass",
            });
            bcrypt.compare.mockResolvedValue(true);
            TokenManager.generateToken.mockReturnValue("testtoken");

            await AuthController.login(req, res);

            expect(res.cookie).toHaveBeenCalledWith(
                "token",
                "testtoken",
                expect.objectContaining({
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 86400000,
                })
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "LOGIN_SUCCESS",
                    message: "User Logged In Successfully",
                    data: {
                        user: { id: "user123", email: "test@example.com" },
                        token: "testtoken",
                    },
                })
            );
        });

        it("should return 500 if an unexpected error occurs", async () => {
            const req = { body: { email: "test@example.com", password: "123456" } };
            const res = mockRes();

            Validation.isNotEmpty.mockReturnValue(true);
            Validation.isEmail.mockReturnValue(true);
            userService.getUserByEmail.mockRejectedValue(
                new Error("DB connection failed")
            );

            await AuthController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "SERVER_ERROR",
                    message: "Login failed",
                    error: "DB connection failed",
                })
            );
        });
    });

    // ------------------ REGISTER ------------------
    describe("register", () => {
        it("should return 400 if any required field is missing", async () => {
            const req = { body: { name: "", email: "", password: "" } };
            const res = mockRes();

            Validation.isNotEmpty.mockReturnValue(false);

            await AuthController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "VALIDATION_ERROR",
                    message: "All fields are required",
                })
            );
        });

        it("should return 400 for invalid email format", async () => {
            const req = { body: { name: "Test", email: "invalid", password: "Password123" } };
            const res = mockRes();

            Validation.isNotEmpty.mockReturnValue(true);
            Validation.isEmail.mockReturnValue(false);

            await AuthController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "VALIDATION_ERROR",
                    message: "Invalid email format",
                })
            );
        });

        it("should return 400 for weak password", async () => {
            const req = { body: { name: "Test", email: "test@example.com", password: "123" } };
            const res = mockRes();

            Validation.isNotEmpty.mockReturnValue(true);
            Validation.isEmail.mockReturnValue(true);
            Validation.passwordStrength.mockReturnValue(false);

            await AuthController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "VALIDATION_ERROR",
                    message: expect.stringContaining("Password must be at least"),
                })
            );
        });

        it("should return 400 if user already exists", async () => {
            const req = { body: { name: "Test", email: "test@example.com", password: "Password123" } };
            const res = mockRes();

            Validation.isNotEmpty.mockReturnValue(true);
            Validation.isEmail.mockReturnValue(true);
            Validation.passwordStrength.mockReturnValue(true);
            userService.getUserByEmail.mockResolvedValue({ email: "test@example.com" });

            await AuthController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "USER_EXISTS",
                    message: "User with this email already exists",
                })
            );
        });

        it("should register user successfully and return 201", async () => {
            const req = {
                body: { name: "Test", email: "test@example.com", password: "Password123" },
            };
            const res = mockRes();

            Validation.isNotEmpty.mockReturnValue(true);
            Validation.isEmail.mockReturnValue(true);
            Validation.passwordStrength.mockReturnValue(true);
            userService.getUserByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue("hashedPassword");

            const savedUser = {
                _id: "newUserId",
                name: "Test",
                email: "test@example.com",
                save: vi.fn().mockResolvedValue(true),
            };
            userService.addUser.mockResolvedValue(savedUser);
            cartService.createCart.mockResolvedValue(true);
            wishlistService.createWishlist.mockResolvedValue(true);
            EmailController.sendWelcomeEmail.mockResolvedValue(true);

            await AuthController.register(req, res);

            expect(userService.addUser).toHaveBeenCalledWith("Test", "test@example.com", "hashedPassword");
            expect(cartService.createCart).toHaveBeenCalledWith("newUserId");
            expect(wishlistService.createWishlist).toHaveBeenCalledWith("newUserId", "My Wishlist", "Default wishlist");
            expect(EmailController.sendWelcomeEmail).toHaveBeenCalledWith(res, "test@example.com", "Test");

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "REGISTER_SUCCESS",
                    data: {
                        user: {
                            id: "newUserId",
                            name: "Test",
                            email: "test@example.com",
                        },
                    },
                })
            );
        });

        it("should return 500 if an error occurs during registration", async () => {
            const req = {
                body: { name: "Test", email: "test@example.com", password: "Password123" },
            };
            const res = mockRes();

            Validation.isNotEmpty.mockReturnValue(true);
            Validation.isEmail.mockReturnValue(true);
            Validation.passwordStrength.mockReturnValue(true);
            userService.getUserByEmail.mockResolvedValue(null);
            userService.addUser.mockRejectedValue(new Error("Something went wrong"));

            await AuthController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "SERVER_ERROR",
                    message: "Registration failed",
                    error: "Something went wrong",
                })
            );
        });
    });

    // ------------------ LOGOUT ------------------
    describe("logout", () => {
        it("should clear token cookie and return 200", async () => {
            const req = {};
            const res = mockRes();

            await AuthController.logout(req, res);

            expect(res.clearCookie).toHaveBeenCalledWith("token", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "LOGOUT_SUCCESS",
                    message: "User logged out successfully",
                })
            );
        });

        it("should return 500 if logout fails", async () => {
            const req = {};
            const res = mockRes();

            res.clearCookie = vi.fn(() => {
                throw new Error("Clear cookie error");
            });

            await AuthController.logout(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "SERVER_ERROR",
                    message: "Logout failed",
                    error: "Clear cookie error",
                })
            );
        });
    });
});
