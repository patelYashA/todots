import mongoose, { Schema, Document, Model } from "mongoose";
const bcrypt = require("bcrypt");

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  comparePassword(plainPassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
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

UserSchema.pre<IUser>("save", async function save(next: any) {
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

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
