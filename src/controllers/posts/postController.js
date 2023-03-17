const connection = require("../../config/db");
const CryptoJS = require("crypto-js");


// get all posts from the database
const getPosts = async (req, res) => {
  try {
    const id = req.id;
    connection.query(
      `SELECT id , title , content FROM posts WHERE author = ${id}`,
      (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
          return res.json({
            success: true,
            message: "posts found",
            result: result,
          });
        } else {
          return res.json({
            success: false,
            message: "posts not found",
          });
        }
      }
    );
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};


// create a post in the database
const createPost = async (req, res) => {
  try {
    const id = req.id;
    // console.log(id);
    const { title, content } = req.body;
    if (!title)
      return res.json({ success: false, message: "title is required" });
    if (!content)
      return res.json({ success: false, message: "content is required" });

    connection.query(
      `SELECT * FROM users WHERE id = ${id}`,
      (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
          const data = { title, content, author: id };
          connection.query("INSERT INTO posts SET ?", data, (error, result) => {
            if (error) throw error;
            res.json({
              success: true,
              message: "post created successfully",
              result: result,
            });
          });
        } else {
          return res.json({
            success: false,
            message: "user not found",
          });
        }
      }
    );
  } catch (error) {}
};

// delete a post from the database
const deletePost = async (req, res) => {
  try {
    const id = req.id;
    const postId = CryptoJS.AES.decrypt(req.header('postId'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    if (!postId)
      return res.json({ success: false, message: "postId is required" });
    connection.query(
      `SELECT * FROM posts WHERE id = ${postId}`,
      (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
          if (result[0].author == id) {
            connection.query(
              `DELETE FROM posts WHERE id = ${postId}`,
              (error, result) => {
                if (error) throw error;
                res.json({
                  success: true,
                  message: "post deleted successfully",
                  result: result,
                });
              }
            );
          } else {
            return res.json({
              success: false,
              message: "you are not authorized to delete this post",
            });
          }
        } else {
          return res.json({
            success: false,
            message: "post not found",
          });
        }
      }
    );
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};


// update a post in the database
const updatepost = async (req, res) => {
  try {
    const id = req.id;
    const postId = CryptoJS.AES.decrypt(req.header('postId'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const { title, content } = req.body;
    if (!postId)
      return res.json({ success: false, message: "postId is required" });
    if (!title)
      return res.json({ success: false, message: "title is required" });
    if (!content)
      return res.json({ success: false, message: "content is required" });
    connection.query(
      `SELECT * FROM posts WHERE id = ${postId}`,
      (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
          if (result[0].author == id) {
            const data = { title, content };
            connection.query(
              `UPDATE posts SET ? WHERE id = ${postId}`,
              data,
              (error, result) => {
                if (error) throw error;
                res.json({
                  success: true,
                  message: "post updated successfully",
                  result: {
                    id: postId,
                    title: title,
                    content: content,
                  },
                });
              }
            );
          } else {
            return res.json({
              success: false,
              message: "you are not authorized to update this post",
            });
          }
        } else {
          return res.json({
            success: false,
            message: "post not found",
          });
        }
      }
    );
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  getPosts,
  createPost,
  deletePost,
  updatepost,
};
