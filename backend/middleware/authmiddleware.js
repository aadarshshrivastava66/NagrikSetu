const jwt=require('jsonwebtoken');

module.exports.isLogedIn=async(req,res,nest)=>{
    try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}