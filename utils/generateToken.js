const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    console.log("JWT_KEY:", process.env.JWT_KEY); // Optional debug
    return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, {
        expiresIn: "1d", // Optional: sets expiration
    });
};

module.exports.generateToken = generateToken;
