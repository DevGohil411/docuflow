const Joi = require('joi');

const validateFileUpdate = (req, res, next) => {
  const schema = Joi.object({
    fileName: Joi.string().min(1).max(255).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details[0].message,
    });
  }
  next();
};

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file ID format',
    });
  }
  next();
};

module.exports = {
  validateFileUpdate,
  validateObjectId,
};
