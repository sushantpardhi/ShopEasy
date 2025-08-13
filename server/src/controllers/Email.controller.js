import EmailService from "../Services/Email.service.js";
import Response from "../Utils/Response.js";
import logger from "../Utils/logger.js";

class EmailController {
    async sendWelcomeEmail(res, to, name) {
        try {
            logger.info(`Sending Email`)
            const subject = "Welcome to Our Store!";
            const html = `<h1>Welcome, ${name}!</h1><p>Thank you for registering at our store. We're excited to have you with us.</p>`;
            await EmailService.sendMail({
                to,
                subject,
                html,
                text: `Welcome, ${name}! Thank you for registering at our store.`
            });
            logger.info(`Email Sent`)
        } catch (error) {
            logger.error(`Email error: ${error}`);
            await Response.error(res, "Email sent error", {}, 400, "EMAIL_SENT");
        }
    }
}

export default new EmailController();

