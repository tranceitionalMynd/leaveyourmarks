var mongoose=require("mongoose");
var bcrypt = require("bcrypt");
var chalk=require("chalk");

//var dbURI = "mongodb://localhost/test";
var dbURI = "mongodb://edureka:edureka@ds157499.mlab.com:57499/leavethemarks-tkc"
mongoose.connect(dbURI);

mongoose.connection.on("connected", function() {
    console.log(chalk.yellow("Mongoose connected to " + dbURI));
});

mongoose.connection.on("error", function(error) {
    console.log(chalk.yellow("Mongoose connection error " + error));
});

mongoose.connection.on("disconnected", function() {
    console.log(chalk.red("Mongoose disconnected"));
});


var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String
});

var storySchema = new mongoose.Schema({
    author: {type: String},
    title: {type: String, unique: true},
    created_at:{type:Date,default:Date.now},
    comments:{type:Array,default:[]},
    summary: {type: String},
    content: {type: String},
    imageLink: {type: String},
    slug: {type: String, unique: true}
});

storySchema.pre('save', function(next) {
    console.log("Storing story!");
    this.slug = this.title.toLowerCase().replace(/[^a-zA-Z0-0]/g, "").replace(/\s+/g, '-');
    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return;
    console.log("Hashing and storing user password!");
    salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next();
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
        if (error) return cb(error);
        cb(null, isMatch);
    });
};

module.exports.User = mongoose.model("User", userSchema);
module.exports.Story = mongoose.model("Story", storySchema);
