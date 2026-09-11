const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ["wqc", "trainer", "admin"],
      default: "wqc"
    },
    location: {
      type: String,
      trim: true,
      default: ""
    },
    organization: {
      type: String,
      trim: true,
      default: ""
    },
    interests: {
      type: [String],
      default: []
    },
    profileImage: {
      type: String,
      default: ""
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

userSchema.set("toJSON", {
  transform: (_document, returnedUser) => {
    delete returnedUser.password;
    delete returnedUser.__v;
    return returnedUser;
  }
});

module.exports = mongoose.model("User", userSchema);
