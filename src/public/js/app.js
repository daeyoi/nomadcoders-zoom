//io function은 알아서 socket.io를 실행하고 있는 서버를 찾음 
const socket = io();

//welcome 가져오기
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone(msg) {
    console.log(`The backend says: `, msg);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, backendDone);
    input.value="";
}

form.addEventListener("submit", handleRoomSubmit);