const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            // Keep your original logic: always 500 with message
            res.status(500).json({
                message: error?.message || "Internal Server Error",
            });
        }
    };
};
export default TryCatch;
