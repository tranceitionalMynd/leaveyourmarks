var express=require("express")();
console.log("1");
var static=require("express").static;
var routes=require("./routes/routes");
var user=require("./routes/user");
var story=require("./routes/story");
var bodyParser=require("body-parser");
var session=require("express-session");
var chalk=require("chalk");
var db=require("./models/db.js")
console.log("2");

express.set("view engine", "ejs");
express.use(static(__dirname + "/public/"));
express.use(bodyParser.json());
express.use(bodyParser.urlencoded({extended:false}));
express.use(session({secret:"qazwsxedcrfvtgbyhnujm", resave: true, saveUninitialized: true}));
console.log("3");

express.use(function(error, request, result, next) {
    console.log(chalk.red("Error: 404"));
    result.status(404).render("404");
});
express.use(function(error, request, result, next) {
    console.log(chalk.red("Error 500"));
    result.status(500).render("500");
});
console.log("4");

express.get('/', routes.index);
express.get('/login', routes.login);
express.get('/register', routes.register);
express.get('/logout', routes.logout);
express.get('/new-story', routes.newStory);
express.get('/techstack', routes.techStack);
express.get('/story', routes.story);
express.get('/stories', story.stories);
express.get('/stories/:story', story.getStory);
//express.get(p'/newUser', routes.newUser);
console.log("5");

express.post('/newUser', user.doCreate);
express.post('/authenticate', routes.authenticate);
express.post('/add-story', story.addStory);
express.post('/stories/:slug/saveComment', story.saveComment);
console.log("6");

// TODO: 404, 500, home, index, story

var port = process.env.PORT || 8080;
var server = express.listen(port, function(request, response) {
   console.log(chalk.green("Listening on port: " + port));
});

console.log("7");
