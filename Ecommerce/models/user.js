const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
    v4: uuidv4
} = require("uuid");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength:8
    },
    about: {
        type: String,
        trim: true,
    },
    role: {
        type: Number,
        default: 0,
    },
    history: {
        type: Array,
        default: [],
    },
}, {
    timestamps: true,
});

userSchema.pre("save", function (next) {
    let user = this;

    if (!user.isModified("password")) return next();
    saltRounds = 10;
   
    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods = {
    authenticate: function (plainText) {
        return bcrypt.compareSync(plainText, this.password);
    },
};

module.exports = mongoose.model("User", userSchema);