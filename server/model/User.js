import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email_Id: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  emails: [String, String, String], 
    cities: [
      {
        name: String,
        coordinates: {
          latitude: Number,
          longitude: Number
        }
      },
  ]
});

export const User = model('User', UserSchema);