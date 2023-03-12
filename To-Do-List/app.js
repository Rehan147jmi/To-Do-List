const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const date = require(__dirname + "/date.js");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/toDolistDB");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

  console.log("connexted");
}
  
const toDoSchema = new mongoose.Schema({
  item: String 
  
});

const Item = mongoose.model("Item", toDoSchema);

const item1 = new Item({
  item: "Buy Food",
});
const item2 = new Item({
  item: "Cook Food",
});
const item3 = new Item({
  item: "Eat Food",
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [toDoSchema],
});

const List = mongoose.model("List", listSchema);



app.get("/", function (req, res) {
  let day = date();
  Item.find()
    .then(function (items) {
      if (items.length === 0) {
        Item.insertMany([item1, item2, item3])
          .then(function () {
            console.log("Inserted Successfully");
          })
          .catch(function (err) {
            console.log(err);
          });
      } else {
        res.render("list", { kindofDay: day, type: "Home", newItem: items });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/:customListName", function (req, res) {
  console.log(req.params.customListName);


  List.findOne({ name: req.params.customListName })
    .then(function (lists) {
      let day = date();
      if (lists) {
        res.render("list", {
          kindofDay: day,
          type: req.params.customListName,
          newItem: lists.items,
        });
      } else {
        const list = new List({
          name: req.params.customListName,
          items: [item1, item2, item3],
        });
        list.save();
        res.redirect("/" + req.params.customListName);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/", function (req, res) {
  const listName = req.body.btn;

  Useritem = {
    item: req.body.UserInput,
  };

  if (listName === "Home") {
    Item.insertMany(Useritem)
      .then(function () {
        console.log("Inserted Successfully");
        res.redirect("/");
      })
      .catch(function (err) {
        console.log(err);
      });

   
  } else {
    List.findOne({ name: listName }).then(function (lists) {
      lists.items.push(Useritem);
      lists.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const id = req.body.check;
  const listName = req.body.listName;

  if (listName === "Home") {
    Item.deleteOne({ _id: id })
      .then(function () {
        console.log("Deleted Successfully");
        res.redirect("/");
      })
      .catch(function (err) {
        console.log(err);
      });

    
  } else {
    
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:id}}})
    .then(function(){
      res.redirect("/" + listName)
    })
    .catch(function(err){
      console.log(err)
    })
  }
});

app.listen(3000, function () {
  console.log("server is running on port 3000");
});
