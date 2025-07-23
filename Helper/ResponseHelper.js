const sendResponse = (res, data, message, statusCode) => {
  return res.status(statusCode).json({
    message,
    data,
    statusCode,
  });
};

module.exports = { sendResponse };

