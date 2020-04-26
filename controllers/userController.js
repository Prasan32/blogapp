const express = require("express");
const app = express();
require("../database/connection");
const Post = require("../models/Post");
const Register = require("../models/Register");

let passport = require("passport");
let passportConfig = require("../auth/passport");
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

exports.index = (req, res) => {
  Post.findAll({
    order: [["id", "DESC"]],
  })
    .then((result) => {
      Post.findAll({ limit: 4, order: [["id", "ASC"]] })
        .then((results) => {
          result.forEach((post) => {
            var desc = post.description;
            post.description = desc.substring(0, 240) + ".....";
          });
          results.forEach((post) => {
            var title = post.title;
            post.title = title.substring(0, 50) + ".....";
          });
          res.render("pages/index", { post: result, posts: results });
        })
        .catch((err) => console.log(err));
    })
    .catch((error) => console.log(error));
};

exports.getPost = (req, res) => {
  res.render("pages/createNewPost", { layout: "dashboardLayout" });
};

exports.post = (req, res) => {
  var img = req.files.image;
  var imageName = img.name;
  img.mv("./public/uploads/" + imageName, (error) => {
    if (error) throw error;
  });
  Post.create({
    title: req.body.title,
    description: req.body.description,
    image: imageName,
    author: req.body.author,
  })
    .then((result) => {
      res.redirect("/");
    })
    .catch((error) => console.log(error));
};

exports.dashboard = (req, res) => {
  Post.count()
    .then((result) => {
      console.log(result);
      res.render("pages/dashboard", {
        layout: "dashboardLayout",
        count: result,
      });
    })
    .catch((error) => console.log(error));
};

exports.getPostInfo = (req, res) => {
  Post.findAll()
    .then((results) => {
      Post.count()
        .then((result) => {
          res.render("pages/postinfo", {
            layout: "dashboardLayout",
            posts: results,
            count: result,
          });
        })
        .catch((error) => console.log(error));
    })
    .catch((err) => console.log(err));
};

exports.getEdit = (req, res) => {
  Post.findAll({
    where: {
      id: req.params.id,
    },
  })
    .then((result) => {
      res.render("pages/edit", { post: result[0], layout: "dashboardLayout" });
    })
    .catch((err) => console.log(err));
};

exports.postEdit = (req, res) => {
  Post.update(
    {
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      author: req.body.author,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((result) => {
      res.redirect("/postinfo");
    })
    .catch((err) => console.log(err));
};

exports.delete = (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((result) => {
      res.redirect("/postinfo");
    })
    .catch((error) => console.log(error));
};

exports.getRegister = (req, res) => {
  res.render("pages/register", { layout: "authLayout" });
};

exports.postRegister = passport.authenticate("local-signup", {
  failureRedirect: "/register",
  successRedirect: "/login",
  session: false,
});

exports.getLogin = (req, res) => {
  res.render("pages/login", { layout: "authLayout" });
};

exports.postLogin = passport.authenticate("local-login", {
  failureRedirect: "/login",
  successRedirect: "/dashboard",
  session: false,
});

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

exports.detail = (req, res) => {
  Post.findAll({ where: { id: req.params.id } })
    .then((result) => {
      Post.findAll({ limit: 4, order: [["id", "ASC"]] })
        .then((results) => {
          results.forEach((post) => {
            var desc = post.description;
            post.description = desc.substring(0, 150) + ".....";
          });
          results.forEach((post) => {
            var title = post.title;
            post.title = title.substring(0, 50) + ".....";
          });
          res.render("pages/detail", { post: result[0], posts: results });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.about = (req, res) => {
  res.render("pages/about");
};

exports.contact = (req, res) => {
  res.render("pages/contact");
};
