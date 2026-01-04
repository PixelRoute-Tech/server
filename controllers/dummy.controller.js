
const {getSocket,getUserSockets} = require("../config/socket.config")

exports.dummyController = async (req, res) => {
  const {data} = req.body
  try {

    return res.success({ status: 200,data });
  } catch (error) {
    console.log(error)
    return res.error({ status: 500, error });
  }
};

exports.dummyOauthCallback = async (req, res) => {
  const token = "test_token_send_from_server"
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 4 * 24 * 60 * 60 * 1000 // 4 days
  });

  res.redirect("http://localhost:8080/");
};