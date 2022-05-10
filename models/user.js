const mongoose=require('mongoose');
const Schema =mongoose.Schema;

//create user schema
const UserSchema= new Schema({
   nom: {
      type:STRING,
      allowNull: false
    },
    prenom: {
      type:STRING,
      allowNull: false
    },
    email: {
      type:STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type:STRING,
      allowNull: false
    },
    isSuperAdmin: {
      type:BOOLEAN,
      defaultValue: false
    }
})