export default function roleAccessControl(req, res, next) {
    
    if (req.user && req.user.role === 'demo' && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        return res.status(403).send('Access denied');
      
    }
    next();
}