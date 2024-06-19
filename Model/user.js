const mongoose = require("mongoose")
const uniq = require("mongoose-unique-validator")

const UserSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {
    timestamps: true
})

UserSchema.plugin(uniq)

module.exports = mongoose.model("test", UserSchema)