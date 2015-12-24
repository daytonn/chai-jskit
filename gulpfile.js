var requireDir = require("require-dir");
var dir = requireDir("./tasks");
var config = require("./tasks/config");
var gulp = require("gulp");

gulp.task("default", function() {
  console.log("");
  console.log("Write some tasks");
  console.log("");
});
