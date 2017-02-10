var mongoose=require("mongoose");
var bcrypt = require("bcrypt");
var chalk=require("chalk");

var dbURI = "mongodb://localhost/test";
mongoose.connect(dbURI);

mongoose.connection.on("connected", function() {
    console.log(chalk.yellow("Mongoose connected to " + dbURI));
});

mongoose.connection.on("error", function(err) {
    console.log(chalk.yellow("Mongoose connection error " + err));
});

mongoose.connection.on("disconnected", function() {
    console.log(chalk.red("Mongoose disconnected"));
});


var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return;
    console.log("Hashing and storing user password.");
    bcrypt.genSalt(10, function(error, salt) {
        if (err) return next(err);
        bcrypt.hash(this.password, salt, function(error, salt) {
            if (err) return next(err);
            this.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports.User = mongoose.model("User", userSchema);
