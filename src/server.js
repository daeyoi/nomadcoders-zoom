//서버가 될 파일 

//http: 기본적으로 node에 설치 되어 있음
import http from "http";
// import WebSocket from "ws";
import {Server} from "socket.io";
import {instrument} from "@socket.io/admin-ui";
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


//createServer를 하려면 requestListner(=app)가 있어야 함
//http 서버
const httpServer = http.createServer(app);

// //ws 서버
// //같은 서버에서 http, ws서버 두개를 돌릴 수 있음.
// const wss = new WebSocket.Server({ httpServer });

//socket.io 서버
//admin page 포함
const ioServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        redentials: true,
    },
});
instrument(ioServer, {
    auth: false
});

console.log("  _   _      _ _         _   _                       _ _ ");
console.log(" | | | | ___| | | ___   | ) | | ___   ___  _ __ ___ | | |");
console.log(" | |_| |/ _ ) | |/ _ )  |  )| |/ _ ) / _ )| '_ ` _ )| | |");
console.log(" |  _  |  __/ | | (_) | | |)  | (_) | (_) | | | | | |_|_|");
console.log(" |_| |_|)___|_|_|)___/  |_| )_|)___/ )___/|_| |_| |_(_|_)");


const handlerListen = () => console.log(`Listening on http://localhost:3000`);

//public rooms를 주는 function
function publicRooms() {
    //sexy한 방법
    const { sockets: { adapter: { sids, rooms } } } = ioServer;
    // //private rooms
    // const sids = ioServer.sockets.adapter.sids;
    // //rooms
    // const rooms = ioServer.sockets.adapter.rooms;
    
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

// room 참가자를 세어주는 function
function countRoom(roomName) {
    // ?의미
    return ioServer.sockets.adapter.rooms.get(roomName)?.size;
}

ioServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";

    // 이벤트 명 호출
    socket.onAny((event) => {
        console.log(ioServer.sockets.adapter);
        console.log(`Socket Event: ${event}`);
    });
    // 방 참가
    socket.on("enter_room", (roomName, nickName, done) => {
        // 닉네임 셋팅, 검토사항: isEmpty
        console.log(nickName+"!!");
        if(nickName) {
            socket["nickname"] = nickName;
        }
        socket.join(roomName);
        done();
        // 메시지를 하나의 소켓에만 전송 (room 내부에 참가 소식)
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        // 메시지를 모든 소켓에게 전송 (존재하는 room들)
        ioServer.sockets.emit("room_change", publicRooms());
    });
    // 방 퇴장 중 (퇴장완료 직전)
    socket.on("disconnecting", () => {
        // 참가 중이었던 room 내부에 소식
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1));
    });
    // 방 퇴장 완료
    socket.on("disconnect", () => {
        // 메시지를 모든 소켓에게 전송 (존재하는 room들)
        ioServer.sockets.emit("room_change", publicRooms());
    });
    
    // 메시지 수신
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    });
    // 닉네임 수신
    socket.on("nickname", (nickname) => socket["nickname"] = nickname);
});
/* //fake database
//서버 연결 시 connection을 담는 용도
const sockets = [];

//socket: 연결된 브라우저와의 contact 라인
//on(event, fucntion)
wss.on("connection", (socket) => {
    sockets.push(socket);
    //기본 닉네임
    socket["nickname"] = "익명";
    //브라우저와 연결 반응 (하지 않아도 연결은 되어있음. frontEnd에서 요청했기 때문에)
    //마치 버튼과도 같음. connection 을 listen해주는 것
    console.log("Connected to Browser ✅");
    //연결 종료 listener
    socket.on("close", () => console.log("Disconnected form Browser ❌"));
    //메시지 수신 listner
    socket.on("message", (msg) => { 
        //메시지 보내기
        const message = JSON.parse(msg);
        switch(message.type) {
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    });
}); */

//http서버에 연결
//http 위에 있는 ws 서버 위에도 연결
httpServer.listen(3000, handlerListen);

// app.listen(3000, handlerListen);
