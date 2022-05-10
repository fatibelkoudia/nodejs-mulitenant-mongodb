const mongoose=require('mongoose');
const Schema =mongoose.Schema;

//create user schema
const UserSchema= new Schema({
   nom: {
      type:String,
      required:[true,'required']
    },
    prenom: {
      type:String,
      required:[true,'required']
    },
    email: {
      type:String,
      required:[true,'required'],
      unique: true
    },
    password: {
      type:String,
      required:[true,'required']
    },
    isSuperAdmin: {
      type:Boolean,
      defaultValue: false
    }

});

const User=mongoose.model('user',UserSchema);
module.exports=User;