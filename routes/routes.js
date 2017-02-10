var db = require("../models/db.js")
var User = db.User;

function index(request, response) {
    response.render('index',{session:request.session});
}

function login(request, response) {
    var email = request.body.email;
    var password = request.body.password;

    User.findOne({email:email}, function(err, user) {
        if (err) {
            console.log(err);
            response.render("login", {errorMessage: "Invalid email or password."});
            return;
        }
        if(typeof(user)== "undefined" || !user){
            console.log("User is null redirecting to login");
            var message="Invalid email or password";
            console.log("Message :"+message);
            response.render("register",{errorMessage:message});
            return;
        }

        user.comparePassword(password, function(error, isMatch) {
            if (!isMatch) {
                console.log("Authentication failed for user " + user.username + ".");
                response.render("register", {errorMessage:"Invalid email or password."});
                return;
            }
            console.log("Authentication successful for user " + user.username + ".");
            request.session.username = user.username;
            request.session.loggedIn = true;
            response.render("new-story", {session: request.session});
        });
    });
}

//function login(request, response) {
//    response.render('login');
//}

function register(request, response) {
    response.render('register');
}

function logout(request, response) {
    var user = request.session.username;
    console.log("Logging out: " + user);
    request.session.destroy();
    response.render("logout", {loggedOutUser:user});
}

module.exports.index=index;
module.exports.login=login;
module.exports.register=register;
module.exports.logout=logout;
