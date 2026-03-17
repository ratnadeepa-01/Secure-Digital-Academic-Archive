const express=require("express");
const router=express.Router();
const authController= require("../controllers/authController");
const validate = require("../middleware/validateMiddleware");
const { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} = require("../utils/validation");

const { protect } = require("../middleware/authMiddleware");

//register new user
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.patch("/profile", protect, authController.updateProfile);
router.patch("/change-password", protect, authController.changePassword);

module.exports=router;