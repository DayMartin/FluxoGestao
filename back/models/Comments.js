const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentsSchema = new Schema ({
    usuario: {
        type: String,
        require:true,
    },
    description: {
        type: String,
        require:true,
    },
  },
  { timestamps: true }
);

const Comments = mongoose.model("Comments", commentsSchema);

module.exports = {
    Comments,
    commentsSchema,
};