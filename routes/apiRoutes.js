// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the profile page.
  // Otherwise the user will be sent an error

  // Login User
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    console.log(req.user);

    // we need to store a session or a loggedInVariable
    res.redirect("/user");
  });

  // Route for creating a new user. If the user is created successfully, proceed to log the user in, otherwise send back an error

  // Sign Up
  app.post("/api/create", function (req, res) {
    console.log(req.body);
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }).then(function () {
      res.redirect("/signIn");
    }).catch(function (err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  // Tracking if the user is logged in
  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
  }

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    console.log(req.user);
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      res.json({
        email: req.user.email,
        id: req.user.id,
      });
    }
  });

  // ************** Review ****************** //

  // GET route for getting all of the reviews
  app.get("/api/reviews", function (req, res) {
    db.Review.findAll({}).then(function (dbReviews) {
      res.json(dbReviews);
    });
  });

  // Create a new review
  app.post("/api/reviews", function (req, res) {
    db.Review.create(req.body).then(function (dbReview) {
      res.json(dbReview);
    });
  });

  // Delete a review by id
  app.delete("/api/reviews/:id", function (req, res) {
    db.Review.destroy({ where: { id: req.params.id } }).then(function (dbReview) {
      res.json(dbReview);
    });
  });

};

