import { Schema, model } from 'mongoose';
import * as passportLocalMongoose from 'passport-local-mongoose';

const unique = true;
const required = true;

export const UserSchema = Schema({
  email: { type: String, unique, required },
  username: { type: String, unique, required },

  password: {
    salt: Number,
    hash: String
  }


});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  saltField: 'password.salt',
  hashField: 'password.hash'
});

UserSchema.virtual('fullName').get(() => this.name.first + ' ' + this.name.last);

export default model('User', UserSchema);
