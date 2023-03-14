//서버가 될 파일 
import express from "express";
// == const express = require('express') 인건가?
const app = express();

//app에 pug 설정
//views 설정
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

//유저가 /public으로 가게 되면 __dirname+"/public" 폴더를 보여주게 함
app.use("/public", express.static(__dirname + "/public"));

//route 생성
//render
//home pug를 render 해주는 route handler
app.get("/", (req, res) => {
    res.render("home");
});

//유저가 어느 url로 들어와도 홈으로 redirect 시켜버림
app.get("/*", (req, res) => res.redirect("/"));

console.log("  _   _      _ _         _   _                       _ _ ");
console.log(" | | | | ___| | | ___   | ) | | ___   ___  _ __ ___ | | |");
console.log(" | |_| |/ _ ) | |/ _ )  |  )| |/ _ ) / _ )| '_ ` _ )| | |");
console.log(" |  _  |  __/ | | (_) | | |)  | (_) | (_) | | | | | |_|_|");
console.log(" |_| |_|)___|_|_|)___/  |_| )_|)___/ )___/|_| |_| |_(_|_)");

app.listen(3000);