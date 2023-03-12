const jwt = require("jsonwebtoken");
const Users = require("../models/userModel")

exports.isAuthenticatedUser = async (req, res, next) => {
    const token = req.body.token
    if (!token) return res.status(401).send({
        message: "Please Login to access this resource"
    })
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Users.findById(decodedData.id);
    next();
};