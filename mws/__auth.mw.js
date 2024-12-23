const jwt = require('jsonwebtoken');
const { SUPERADMIN, SCHOOL_ADMIN } = require('../libs/utils');
const User = require('../managers/models/user.model');
const School = require('../managers/models/school.model');

module.exports = ({ meta, config, managers }) => {
  return {
    authenticate: async (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: 'unauthorized'});
        // return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).populate(School);
        if (!user) return res.status(401).json({ error: 'Invalid token' });

        req.user = user;
        next();
      } catch (err) {
        return res.status(401).json({ error: 'Token verification failed' });
      }
    },

    authorizeSuperadmin: (req, res, next) => {
      if (req.user.role !== SUPERADMIN) {
        return res.status(403).json({ error: 'Access denied. Requires superadmin role.' });
      }
      next();
    },

    authorizeSchoolAdmin: (req, res, next) => {
      if (req.user.role !== SUPERADMIN && req.user.role !== SCHOOL_ADMIN) {
        return res.status(403).json({ error: 'Access denied.' });
      }
      next();
    },

    authorizeSchoolResource: async (req, res, next) => {
      // For routes that require the user to manage only their assigned school's resources.
      // If user is superadmin, no limitation. If school_admin, must match their school.
      if (req.user.role === SUPERADMIN) {
        return next();
      }
      // If school_admin, check resource's school
      const { schoolId } = req.params;
      if (!req.user.school || req.user.school._id.toString() !== schoolId) {
        return res.status(403).json({ error: 'Not authorized to access this school resource.' });
      }
      next();
    }
  };
};