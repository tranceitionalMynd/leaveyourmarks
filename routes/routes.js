var db = require("../models/db.js")
var User = db.User;

function index(request, response) {
    response.render('index',{session:request.session});
}

function authenticate(request, response) {
    var email = request.body.email;
    var password = request.body.password;

    console.log("Authenticating!");
    console.log("Authenticate session: " + request.session);

    User.findOne({email:email}, function(err, user) {
        if (err) {
            console.log("Error: " + err);
            response.render("login", {errorMessage: "Invalid email or password."});
            return;
        }
        if(typeof(user)== "undefined" || !user){
            console.log("User is null redirecting to login");
            var message="User " + email + " has not been registered.";
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
            console.log("Authenticate session user: " + request.session.username);
            response.render("new-story", {session: request.session});
        });
    });
}

function login(request, response) {
    console.log("Serving login page.")
    response.render('login');
}

function register(request, response) {
    console.log("Serving register page.");
    response.render('register');
}

function logout(request, response) {
    console.log("Serving logout page.");
    var user = request.session.username;
    console.log("Logging out: " + user);
    request.session.destroy();
    response.render("logout", {loggedOutUser:user});
}

function newStory(request, response) {
    console.log("Serving newStory page.");
    console.log("NewStory session username: " + request.session.username);
    response.render("new-story", {session:request.session});
}

function techStack(request, response) {
    console.log("Serving techStack page.");
    response.render("techStack", {session:request.session});
}

function story(request, response) {
    console.log("Serving story page.");
    response.render("story", story);
}

function newUser(request, response) {
    console.log("Serving new user page.");
    response.render("new-user");
}

/*function newUser(request, response) {
    console.log("Serving newUser page.");
    if (request.session.loggedIn) {
        console.log("User " + request.session.user + " is logged in.")
        response.redirect('login');
    } else if (!request.session.user) {
        console.log("User session missing from new registration!")
        response.redirect('login');
    } else {
        
        console.log("User " + request.session.user + " is registered.")
        response.render('new-story', {session:request.session});
    }
}
*/



module.exports.index=index;
module.exports.login=login;
module.exports.register=register;
module.exports.logout=logout;
module.exports.newStory=newStory;
module.exports.techStack=techStack;
module.exports.story=story;
module.exports.newUser=newUser;
module.exports.authenticate=authenticate;
