const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            console.error("========== ERROR ==========");
            console.error(error);
            console.error(error.stack);
            console.error("===========================");
            res.status(500).json({
                message: error.message,
            });
        }
    };
};
export default TryCatch;
