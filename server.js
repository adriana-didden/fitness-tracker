const express = require("express");
const router= require("express").Router();
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });


db.Workout.create({ name: "" })
  .then(dbWorkout => {
    console.log(dbWorkout);
  })
  .catch(({ message }) => {
    console.log(message);
  });

app.post("/submit", ({ body }, res) => {
    db.exercise.create(body)
      .then(({ _id }) => db.Workout.findOneAndUpdate({}, { $push: { exercise: _id } }, { new: true }))
      .then(dbWorkout => {
        res.json(dbWorkout);
      })
      .catch(err => {
        res.json(err);
      });
  });
app.get("/api/workouts", (req, res)=>{
    db.Workout.find()
    .then(results => console.log(results))
})

router.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/exercise.html"));
  });

// app.get("/exercise", (req, res)=>{
//     db.Workout.find()
//     .populate("exercise")
//   });

// Start the server

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});