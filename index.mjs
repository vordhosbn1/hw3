import express from "express";
import { faker } from "@faker-js/faker";

let app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.title = "HW3";
  res.locals.path = req.path;
  next();
});

app.get("/", (req, res) => {
  res.render("home.ejs", { title: "Home" });
});

app.get("/searchName", async (req, res) => {
  let raw = (req.query.name || "").trim();
  let name = raw.toLowerCase();
  let g = null;
  let error = null;

  if (name) {
    try {
      const r = await fetch(`https://api.genderize.io?name=${encodeURIComponent(name)}`);
      if (!r.ok) throw new Error("Genderize request failed");
      g = await r.json();
    } catch (e) {
      error = e.message;
    }
  }

  res.render("searchName.ejs", {
    title: "Search Name",
    name: raw,
    g: g,
    error: error
  });
});

app.get("/randomPerson", (req, res) => {
  res.render("randomPerson.ejs", { title: "Random Person" });
});

app.get("/results", (req, res) => {
  let randomName = faker.person.fullName();
  let city = faker.location.city();
  let email = faker.internet.email();
  let country = faker.location.country();
  let address = faker.location.streetAddress();
  let phone = faker.phone.number();
  let company = faker.company.name();
  let avatar = faker.image.avatar();

  res.render("results.ejs", {
    title: "Results",
    randomName,
    city,
    email,
    country,
    address,
    phone,
    company,
    avatar,
  });
});

app.listen(3000, () => {
  console.log("server started");
});
