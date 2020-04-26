const Register = require("../models/Register");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
// const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const con = require("../database/connection");

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    Register.findAll({ where: { id: id } })
      .then((rows) => {
        return done(rows);
      })
      .catch((error) => {
        return done(error);
      });
  });

  passport.use(
    "local-signup",
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        const schema = Joi.object().keys({
          email: Joi.string().trim().email().required(),
          password: Joi.string().min(5).max(10).required(),
        });
        Joi.validate(req.body, schema, (error, result) => {
          if (error) {
            console.log(error);
            throw error;
            // req.flash('error_msg','An error has occured')
          }
          console.log(result);
        });
        Register.findAll({ where: { email: email } })
          .then((rows) => {
            if (rows.length) {
              return done(
                null,
                false,
                req.flash("error_message", "That email is already taken")
              );
            } else {
              bcrypt.hash(req.body.password, 10, (error, hash) => {
                var email = req.body.email;
                var password = hash;
                var data = { email, password };
                Register.create({
                  email: email,
                  password: password,
                })
                  .then((rows) => {
                    return done(
                      null,
                      data,
                      req.flash("success_message", "Successfully registered!!!")
                    );
                  })
                  .catch((error) => {
                    return done(error);
                  });
              });
            }
          })
          .catch((error) => {
            return done(error);
          });
      }
    )
  );

  passport.use(
    "local-login",
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        Register.findAll({ where: { email: email } })
          .then((rows) => {
            if (!rows.length) {
              return done(
                null,
                false,
                req.flash("error_message", "No user found")
              );
            }
            bcrypt.compare(password, rows[0].password, (error, result) => {
              if (result) {
                var id;
                req.session.userid = rows[0].id;
                req.session.email = rows[0].email;
                return done(
                  null,
                  rows[0],
                  req.flash("success_message", "Successfully logged in!!!")
                );
              } else {
                return done(
                  null,
                  false,
                  req.flash("error_message", "OOPs ! Wrong password")
                );
              }
            });
          })
          .catch((error) => {
            return done(error);
          });
      }
    )
  );
};
