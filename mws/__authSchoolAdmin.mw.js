const jwt        = require('jsonwebtoken');
const { SUPERADMIN, SCHOOL_ADMIN } = require('../libs/utils');
const User = require('../managers/models/user.model');
const School = require('../managers/models/school.model');

module.exports = ({ meta, config, managers }) =>{
    return async ({req, res, next})=>{
        const authHeader = req.headers.authorization;
              if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: 'unauthorized'});
                // return res.status(401).json({ error: 'No token provided' });
              }
        
              const token = authHeader.split(' ')[1];
              try {
                const decoded = jwt.verify(token, config.dotEnv.LONG_TOKEN_SECRET);

                const user = await User.findById(decoded.userId).populate('schoolId');

                if (!user) return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: 'Invalid token'});
                
                if (user.role === SCHOOL_ADMIN) {
                    const { schoolId } = req.query; // Assuming schoolId is passed as a URL parameter
                    if (!schoolId) {
                        return managers.responseDispatcher.dispatch(res, { ok: false, code: 400, errors: 'schoolId is required' });
                    }
                    if (user.schoolId._id.toString() !== schoolId) {
                        return managers.responseDispatcher.dispatch(res, { ok: false, code: 403, errors: 'Access denied. You can only access your own school.' });
                    }
                } else if (user.role === SUPERADMIN) {

                } else {
                    return managers.responseDispatcher.dispatch(res, {ok: false, code:403, errors: 'Access denied. Requires superadmin or school_admin role.'});
                }
                
                next(user);
              } catch (err) {
                console.log(err);
                return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: 'Token verification failed'});
              }
    }
}