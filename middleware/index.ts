const cors = require("cors");
const helmet = require("helmet");
const useragent = require("express-useragent");
const compression = require("compression");

const middleware: any= [];

const userAgentAndIp = () => (req: any, res: any, next: any) => {
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  req.useragent.toString = () =>
    `${req.useragent.platform} ${req.useragent.os} ${req.useragent.browser} ${
      req.useragent.version
    } ${req.useragent.isMobile ? "Mobile" : ""}`;
  req.clientIp = clientIp;
  next();
};

middleware.push(
  cors({
    origin: true,
    credentials: true,
  })
);

middleware.push(useragent.express());

middleware.push(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https:", "data:"],
    },
  })
);

middleware.push(compression());
middleware.push(userAgentAndIp());

export default middleware;
