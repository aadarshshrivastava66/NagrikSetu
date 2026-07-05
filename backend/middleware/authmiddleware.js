const jwt=require('jsonwebtoken');

module.exports.isLogedIn=async(req,res,next)=>{
  
    try {
    const token = req.cookies.token;
   

    if (!token) {
      return res.status(401).json({ message: "Not authenticated. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to do this" });
    }
    next();
  };
};