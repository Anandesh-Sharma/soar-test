const useragent         = require('useragent');
const requestIp         = require('request-ip');

const rateLimitStore = {};

module.exports = ({ meta, config, managers }) =>{
    return ({req, res, next})=>{
        let ip = 'N/A';
        let agent = 'N/A';
        ip = requestIp.getClientIp(req) || ip;
        agent = useragent.lookup(req.headers['user-agent']) || agent;
        const device = {
            ip, agent
        }
        const windowMs = 15 * 60 * 1000; // 15 minutes
        const maxRequests = 10; 

        if (!rateLimitStore[ip]) {
            rateLimitStore[ip] = { count: 1, startTime: Date.now() };
        } else {
            const currentTime = Date.now();
            const elapsedTime = currentTime - rateLimitStore[ip].startTime;

            if (elapsedTime < windowMs) {
                rateLimitStore[ip].count += 1;
                if (rateLimitStore[ip].count > maxRequests) {
                    return managers.responseDispatcher.dispatch(res, { ok: false, code: 429, errors: 'Too many requests, please try again later.' });
                }
            } else {
                rateLimitStore[ip] = { count: 1, startTime: currentTime };
            }
        }

        next(device);
    }
}