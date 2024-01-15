const { isValidObjectId } = require("mongoose");

const { HttpsErrors } = require("../helpers/HttpError");

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(HttpsErrors(400`${id} is not valid id`));
  }
  next();
};

module.exports = isValidId;
