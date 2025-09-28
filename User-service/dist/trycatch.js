const trycatch = (hardler) => {
    return async (req, res, next) => {
        try {
            await hardler(req, res, next);
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    };
};
export default trycatch;
