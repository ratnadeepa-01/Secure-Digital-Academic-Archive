const User=require("../models/User");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto = require("crypto");
const { sendWelcomeEmail, sendPasswordResetEmail } = require("../utils/emailService");

// Register new user
exports.register=async(req,res)=>{
    try{
       const {name,email,password,role}=req.body;
       const existingUser=await User.findOne({email});
       // Check if user already exists
       if(existingUser){
        return res.status(400).json({message:"User already exist"});
       }
       // Hash password
       const hashedPassword=await bcrypt.hash(password,10);
       const user = await User.create({
        name,
        email,
        password:hashedPassword,
        role
       });

       // Send Welcome Email (async, don't block response)
       sendWelcomeEmail(user).catch(err => console.error("Registration welcome email skipped", err));

       res.status(201).json({message:"User registered successfully"});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

//Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Forgot Password - Generate link and send email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Hash token and set expiry (1 hour)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send the email
    const emailResult = await sendPasswordResetEmail(user, resetToken);

    if (!emailResult.success) {
      return res.status(500).json({ 
        message: "Error sending email", 
        error: emailResult.error 
      });
    }

    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Reset Password - Set new password from token
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    // Hash the token from URL to compare with DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired" });
    }

    // Hash new password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: err.message });
  }
};