export const isAdmin = (req, res, next) => {
    const userId = req.user?.role;
    if (userId !== 'admin') {
        return res.status(403).json({
            message: 'Access denied. Admins only.',
        });
    }
    next();
}