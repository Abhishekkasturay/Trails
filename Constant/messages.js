const messages = {
  USER: {
    CREATED: "User created sucessfully...",
    NOT_FOUND: "User not found",
    UPADATED_USER: "User updated successfully",
    DELETED_USER: "User deleted successfully",
    FETCHED_USER: "User fetched successfully",
    PROFILE_UPDATED: "Profile updated successfully",
  },
  AUTH: {
    REGISTER_SUCCESS: "Registration successful.",
    LOGIN_SUCCESS: "login successfully",
    LOGIN_FAILED: "Invalid Credentials",
    USER_NOT_FOUND: "user not found",
    UNAUTHORIZED: "unauthorized user",
    USER_ALREADY_CREATED: "user already created",
    TOKEN_MISSING: "Authentication token is missing.",
    TOKEN_INVALID: "Invalid token",
    EMAIL_FAILED: "Email is required",
    MOBILE_ALREADY_IN_USE: "Mobile number already in use",
  },
  GENERAL: {
    SERVER_ERROR: "something went wrong",
    BAD_REQUEST: "invalid request",
    VALIDATION: "validation failed",
    TOKEN_INVALID: "Invalid or expired token.",
  },
  OTP: {
    OTP_SEND: "OTP send",
    OTP_FAILED: "Failed to send OTP",
    OTP_SEND_USER: "OTP sent to email",
    OTP_NOT_REQUESTED: "OTP not requested",
    OTP_EXPIRED: "OTP has expired",
    OTP_INVALID:"Invalid OTP"
  },
  POST: {
    POST_CREATED: "Post created successfully",
    POST_FETCHED: "Posts fetched successfully",
  },
};

module.exports = messages;
