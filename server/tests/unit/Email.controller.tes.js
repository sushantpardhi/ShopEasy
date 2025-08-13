import { describe, it, expect, vi, beforeEach } from "vitest";
import EmailController from "../../src/controllers/Email.controller.js";
import EmailService from "../../src/Services/Email.service.js";

vi.mock("../../src/Services/Email.service.js");

describe("EmailController", () => {
    const mockRes = {}; // unused in current method, but kept for consistency

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("sendWelcomeEmail", () => {
        it("should send welcome email with correct content", async () => {
            EmailService.sendMail.mockResolvedValue();

            const to = "user@example.com";
            const name = "John Doe";

            await EmailController.sendWelcomeEmail(mockRes, to, name);

            expect(EmailService.sendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    to,
                    subject: "Welcome to Our Store!",
                    html: expect.stringContaining(`Welcome, ${name}`),
                    text: expect.stringContaining(`Welcome, ${name}`),
                })
            );
        });

        it("should log error if sending fails", async () => {
            const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
            EmailService.sendMail.mockRejectedValue(new Error("SMTP error"));

            await EmailController.sendWelcomeEmail(mockRes, "user@example.com", "Jane");

            expect(consoleSpy).toHaveBeenCalledWith(
                "Failed to send welcome email:",
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });
    });
});
