import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long.'],
      maxlength: [512, 'Full name cannot exceed 100 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      maxlength: [1024, 'Email cannot exceed 254 characters.'],
    },
    emailHash: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      select: false,
    },
    profileImage: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'deactivated'],
      default: 'active',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_document, returnedObject) => {
        delete returnedObject.password;
        delete returnedObject.emailHash;
        delete returnedObject.__v;
        return returnedObject;
      },
    },
  },
);

// Composite index for admin queries.
userSchema.index({ accountStatus: 1, role: 1 });

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

export default User;
