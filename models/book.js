const { Schema, model } = require("mongoose");
const Joi = require("joi");
const handleMongooseError = require("../helpers/handleMongooseError");

const genreList = ["fantastic", "love"];
const dateRegexp = /^\d{2}-\d{2}-\d{4}$/;

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    genre: { type: String, enum: genreList, required: true },
    date: { type: String, match: dateRegexp, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { versionKey: false, timestamps: true }
);

bookSchema.post("save", handleMongooseError);

const Book = model("book", bookSchema);

const addSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  favorite: Joi.boolean(),
  genre: Joi.string()
    .valid(...genreList)
    .required(),
  date: Joi.string().pattern(dateRegexp).required(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = { addSchema, updateFavoriteSchema };

module.exports = { Book, schemas };
