const { Schema, models, model } = require("mongoose");

const configurationSchema = new Schema({
    name: {type:String, required: true, unique: true},
    value: {type:Object},
}, {timestamps:true})

export const Configuration = models?.Configuration || model('Configuration', configurationSchema)