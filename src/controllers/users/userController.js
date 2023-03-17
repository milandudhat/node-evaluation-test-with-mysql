const connection = require("../../config/db");
const Crptojs = require("crypto-js");
const jwt = require("jsonwebtoken");

// get all users from the database
const getUser = async (req, res) => {
  try {
    connection.query("SELECT name , email FROM users", (error, result) => {
      if (error) throw error;
      res.json({
        success: true,
        message: "data fetched successfully",
        result: result,
      });
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

// register a new user to the database
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const validEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!name) return res.json({ success: false, message: "name is required" });
    if (!email)
      return res.json({ success: false, message: "email is required" });
    if (!password)
      return res.json({ success: false, message: "password is required" });
    if (!validEmail.test(email))
      return res.json({ success: false, message: "email is not valid" });
    if (password.length < 6)
      return res.json({
        success: false,
        message: "password must be at least 6 characters",
      });
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
          return res.json({
            success: false,
            message: "email already exists",
            result: {
              email: result[0].email,
            },
          });
        } else {
          const hashPassword = Crptojs.AES.encrypt(
            password,
            process.env.SECRET_KEY
          ).toString();
          connection.query(
            "INSERT INTO users SET ?",
            { name, email, password: hashPassword },
            (error, result) => {
              if (error) throw error;
              return res.json({
                success: true,
                message: "user registered successfully",
                result: result,
              });
            }
          );
        }
      }
    );
  } catch (error) {
    return res.json({
      success: false,
      message: error,
    });
  }
};



// login a user to the database
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email)
      return res.json({ success: false, message: "email is required" });
    if (!password)
      return res.json({ success: false, message: "password is required" });
    if (!validEmail.test(email))
      return res.json({ success: false, message: "email is not valid" });
    if (password.length < 6)
      return res.json({
        success: false,
        message: "password must be at least 6 characters",
      });

    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
          const bytes = Crptojs.AES.decrypt(
            result[0].password,
            process.env.SECRET_KEY
          );
          const originalPassword = bytes.toString(Crptojs.enc.Utf8);
          if (originalPassword === password) {
            const userData = jwt.sign(
              { id: result[0].id },
              process.env.SECRET_KEY,
              { expiresIn: "24h" }
            );
            return res.json({
              success: true,
              message: "login successfully",
              result: {
                // id : result[0].id ,
                name: result[0].name,
                email: result[0].email,
              },
              token: userData,
            });
          } else {
            return res.json({
              success: false,
              message: "password is incorrect",
            });
          }
        } else {
          return res.json({
            success: false,
            message: "email is not registered",
          });
        }
      }
    );
  } catch (error) {
    return res.json({
      success: false,
      message: error,
    });
  }
};


// update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const id = req.id;
    // console.log(id);
    if (!name) return res.json({ success: false, message: "name is required" });
    if (!password)
      return res.json({ success: false, message: "password is required" });
    if (password.length < 6)
      return res.json({
        success: false,
        message: "password must be at least 6 characters",
      });
    connection.query(
      `SELECT * FROM users WHERE id = ${id}`,
      (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
          const hashPassword = Crptojs.AES.encrypt(
            password,
            process.env.SECRET_KEY
          ).toString();
          const data = { name, password: hashPassword };
          connection.query(
            "UPDATE users SET ? WHERE id = ?",
            [data, id],
            (error, result) => {
              if (error) throw error;
              return res.json({
                success: true,
                message: "user updated successfully",
                result: result,
              });
            }
          );
        } else {
          return res.json({
            success: false,
            message: "user not found",
          });
        }
      }
    );
  } catch (error) {
    return res.json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
  updateUserProfile,
};
