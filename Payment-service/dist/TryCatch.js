const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            console.error("❌ Error in controller:", error); // ADD THIS LINE
            res.status(500).json({
                message: error.message,
            });
        }
    };
};
export default TryCatch;
