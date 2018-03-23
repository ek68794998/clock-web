const path = require("path");
const express = require("express");

var wwwroot = path.resolve(__dirname, "wwwroot");
var port = 6627;

var app = express();

app.use(express.static(wwwroot));
app.get("/*", function(req, res) {
    res.sendFile(path.resolve(wwwroot, "index.html"));
});

app.listen(port, function() {
    console.log("Server running on " + port + "...");
});
