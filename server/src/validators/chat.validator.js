import Joi from 'joi';

export default Joi.object({

  message:
    Joi.string()

      .trim()

      .required()

      .max(2000),

});