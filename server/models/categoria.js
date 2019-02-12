const mongoose = require("mongoose");

const Schema = mongoose.Schema;


let CategoriaSchema = new Schema({
    description:{
        type: String, unique: true, required:[true,'Description is required']},
    userId:{type:Schema.Types.ObjectId, ref:'usuario'}
    
});

module.exports = mongoose.model('categoria', CategoriaSchema);