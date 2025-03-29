// Middleware to perform various checks before proceeding to the next route handler

const checkAuthentication = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }
    next();
};

const validateRequestBody = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }
        next();
    };
};

const checkAdminPrivileges = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin privileges required' });
    }
    next();
};

module.exports = {
    checkAuthentication,
    validateRequestBody,
    checkAdminPrivileges
};