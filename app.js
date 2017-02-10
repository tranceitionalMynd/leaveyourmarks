var express=require("express")();
var static=require("express").static;
var routes=require("./routes/routes");
var bodyParser=require("body-parser");
var session=require("express-session");
var chalk=require("chalk");
var db=require("./models/db.js")

express.set("view engine", "ejs");
express.use(static(__dirname + "/public/"));
express.use(bodyParser.json());
express.use(bodyParser.urlencoded({extended:false}));
express.use(session({secret:"qazwsxedcrfvtgbyhnujm", resave: true, saveUninitialized: true}));

express.get('/', routes.index);
express.get('/login', routes.login);
express.get('/register', routes.register);
express.get('/logout', routes.logout);

var port = process.env.PORT || 8080;
var server = express.listen(port, function(request, response) {
   console.log(chalk.green("Listening on port: " + port));
});
