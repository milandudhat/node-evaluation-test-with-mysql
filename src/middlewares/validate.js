const jwt = require("jsonwebtoken");
const validateUser = (req, res, next) => {

  // get the token from the header
  const token = req.header("auth-token");

  // check if the token is not present
  if (!token) {
    return res.json({
      status_code: 400,
      message: "Access Denied",
    });
  }

  try {
    // verify the token
    const userData = jwt.verify(token, process.env.SECRET_KEY);
    req.id = userData.id;
    next();
  } catch (error) {
    return res.json({
      status_code: 400,
      message: "Invalid Token",
    });
  }
};

module.exports = validateUser;
