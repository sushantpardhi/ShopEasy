class Response {
    static success(
        res,
        message = "Success",
        data = {},
        status = 200,
        code = "SUCCESS",
        meta = {}
    ) {
        return res.status(status).json({
            success: true,
            status: status,
            code: code,
            message: message,
            data: data,
            meta: meta,
            timestamp: new Date().toISOString()
        });
    }

    static error(
        res,
        message = "Something went Wrong",
        data = {},
        status = 500,
        code = "ERROR",
        error = null,
        meta = {}
    ) {
        return res.status(status).json({
            success: false,
            status: status,
            code: code,
            message: message,
            data: data,
            error: error || 'An error occurred',
            meta: meta,
            timestamp: new Date().toISOString()
        });
    }
}

export default Response;