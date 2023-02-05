const joi = require("joi");

const userValidation = (body) => {
  const userValidationSignUp = joi.object({
    username: joi.string().min(2).max(30).required(),
    email: joi.string().email().trim().required(),
    password: joi.string().min(8).max(30).required(),
  });

  const userValidationLogin = joi.object({
    email: joi.string().email().trim().required(),
    password: joi.string().min(8).max(30).required(),
  });

  return {
    userValidationSignUp: userValidationSignUp.validate(body),
    userValidationLogin: userValidationLogin.validate(body),
  };
};

module.exports = userValidation;
