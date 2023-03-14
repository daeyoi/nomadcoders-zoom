//서버가 될 파일 

//http: 기본적으로 node에 설치 되어 있음
import http from "http";
import WebSocket from "ws";
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


const handlerListen = () => console.log(`Listening on http://localhost:3000`);


//createServere를 하려면 requestListner(=app)가 있어야 함
//http 서버
const server = http.createServer(app);

//ws 서버
//같은 서버에서 http, ws서버 두개를 돌릴 수 있음.
const wss = new WebSocket.Server({ server });

//http서버에 연결
//http 위에 있는 ws 서버 위에도 연결
server.listen(3000, handlerListen);

// app.listen(3000, handlerListen);