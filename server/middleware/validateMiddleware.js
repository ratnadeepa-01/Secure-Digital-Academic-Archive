const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  
  if (!result.success) {
    const errorMessages = result.error.issues.map((err) => ({
      path: err.path.join("."),
      message: err.message
    }));
    
    return res.status(400).json({
      message: "Validation failed",
      errors: errorMessages
    });
  }
  
  // Update req.body with the parsed (and potentially transformed) data
  req.body = result.data;
  next();
};

module.exports = validate;
