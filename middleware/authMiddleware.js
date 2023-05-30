const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    // return res.status(401).json({ error: "Unauthorized" });
    return res.redirect("/login");
  }

  jwt.verify(token, "aniket hoon main", (err, decoded) => {
    if (err) {
    //   return res.status(403).json({ error: "Invalid token" });
      console.log(err);
      return res.redirect("/login");
    }

    // Add the decoded token to the request object
    req.user = decoded;

    next();
  });
};

module.exports = authenticateToken;
