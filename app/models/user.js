const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    name: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

userSchema.pre('save', function (next) {
    if(this.isNew || this.isModified('password')) {
        bcrypt.hash(this.password, 10, 
            (err, hashedPassword) => {
                if(err)
                    next(err);
                else {
                    this.password = hashedPassword;
                    next();
                }
            }
        )
    }
})  

userSchema.methods.isCorrectPassword = function (password, next) {
    bcrypt.compare(password, this.password, function(err, same) {
        if(err)
            next(err);
        else
            next(err, same);
    })
}

module.exports = mongoose.model('User', userSchema);