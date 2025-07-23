const messages = require("../Constant/messages");
const { verifyToken } = require("../Helper/JwtHelper");
const { sendResponse } = require("../Helper/ResponseHelper");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendResponse(res, {}, messages.AUTH.TOKEN_MISSING, 422);
  }

  const token = authHeader.split(" ")[1];
  const result = verifyToken(token);

  if (!result.valid) {
    return sendResponse(res, {}, messages.AUTH.TOKEN_INVALID, 422);
  }

  req.user = result.decoded; // Add user info to request
  next();
};

module.exports = authMiddleware;
