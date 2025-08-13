import Response from "../Utils/Response.js";

// middleware/errorHandler.js
export function errorHandler(err, req, res) {
    // Log the error for debugging
    console.error("Unhandled error:", err);

    // Check if res exists and is usable
    if (!res || typeof res.status !== "function") {
        console.error("Response object is undefined or malformed.");
        return;
    }

    // Handle known error types
    if (err && err.name === "CastError") {
        return Response.error(res, "Invalid ID format", {}, 400, "VALIDATION_ERROR", err.message);
    }

    const statusCode = err?.status || 500;
    const message = err?.message || "Internal Server Error";

    return Response.error(res, message, {}, statusCode, "SERVER_ERROR", err.stack || err.message);
}
