import express from "express";
import _ from "lodash";

const app= express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

const posts=[];

app.post("/compose", (req, res) => {

  let image = "/images/default.jpg";

  switch(req.body.category){

    case "Technology":
      image = "/images/technology.png";
      break;

    case "Travel":
      image = "/images/travel.png";
      break;

    case "Food":
      image = "/images/food.png";
      break;

    case "Life":
      image = "/images/life.png";
      break;
  }

  posts.push({
    id: Date.now(),
    title: req.body.title,
    category: req.body.category,
    content: req.body.content,
    image: image
  });

  res.redirect("/");
});

app.get("/compose", (req, res) => {
    res.render("compose.ejs");
});

app.get("/", (req, res) => {

  const categoryStats = {};

  posts.forEach(post => {

    const category = post.category || "General";

    categoryStats[category] =
      (categoryStats[category] || 0) + 1;
  });

  const latestPosts =
    [...posts]
      .reverse()
      .slice(0, 5);

  res.render("home.ejs", {
    posts,
    latestPosts,
    categoryStats
  });

});

app.get("/search", (req, res) => {

  const query =
    req.query.query.toLowerCase();

  const results = posts.filter(post =>

    post.title.toLowerCase().includes(query) ||

    post.content.toLowerCase().includes(query) ||

    post.category.toLowerCase().includes(query)

  );

  res.render("search.ejs", {
    results,
    query
  });
});

app.get("/edit/:id", (req, res) => {

  const id = Number(req.params.id);

  const post = posts.find(
    p => p.id === id
  );

  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("edit.ejs", {
    post
  });

});

app.post("/edit/:id", (req, res) => {

  const id = Number(req.params.id);

  const post = posts.find(
    p => p.id === id
  );

  if (post) {

    post.title = req.body.title;

    post.category =   
      req.body.category;

    post.content =
      req.body.content;
  }

  res.redirect("/");

});
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs",{success: false});
});

app.post("/contact", (req, res) => {

  const { name, email, message } = req.body;

  console.log("Contact Form Submitted");
  console.log(name);
  console.log(email);
  console.log(message);

  res.render("contact.ejs", {
    success: true
  });

});

app.get("/posts/:id", (req, res) => {

  const id = Number(req.params.id);

  const foundPost = posts.find(
    post => post.id === id
  );

  if (!foundPost) {
    return res.status(404).send("Post not found");
  }

  res.render("post.ejs", {
    post: foundPost
  });

});

app.post("/delete/:id", (req, res) => {

  const id = Number(req.params.id);

  const index = posts.findIndex(
    post => post.id === id
  );

  if (index !== -1) {
    posts.splice(index, 1);
  }

  res.redirect("/");

});

app.listen(port,()=>{
    console.log(`server is running on post ${port}`);
});
