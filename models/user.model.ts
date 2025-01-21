import mongoose, { Schema, Document, Model } from "mongoose";
const bcrypt = require("bcrypt");

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.pre("save", async function save(next: any) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function comparePassword(
  plainPassword: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, this.password, (err: any, isMatch: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

const UserModel: any = mongoose.model("User", UserSchema);

export default UserModel;
