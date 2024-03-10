function sendtoken(user, res, statuscode) {
  const token = user.getjwttoken();
  // now we get token successfully then we need to set in the cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("token", token).status(200).json({
    success: true,
    message: "Account created successfully",
    user,
    token
  });
}
export default sendtoken;
