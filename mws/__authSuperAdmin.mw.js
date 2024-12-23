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
                console.log(decoded);
                const user = await User.findById(decoded.userId).populate('schoolId');

                if (!user) return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: 'Invalid token'});

                if (user.role !== SUPERADMIN) {
                  return managers.responseDispatcher.dispatch(res, {ok: false, code:403, errors: 'Access denied. Requires superadmin role.'});
                }
                next(user);
              } catch (err) {
                console.log(err);
                return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: 'Token verification failed'});
              }
    }
}