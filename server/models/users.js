const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


let rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} No es un rol Valido'
}

let Schema = mongoose.Schema;


let userSchema = new Schema({
    name:{
        type:String,
        required:[true,'Name is required']
    },
    email:{
        type:String,
        unique:true,
        required:[true, 'Email is required']
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    img:{
        type:String,
        //required:[false,'image is not required']
    },
    role:{
        type:String,
       // required:[false,'Role is not required'],
        default:'USER_ROLE',
        enum: rolesValidos
    },
    status:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
});
userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.plugin(uniqueValidator, {message:'{PATH} debe ser unico'});
module.exports = mongoose.model('usuario', userSchema);