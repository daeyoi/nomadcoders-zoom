// io function은 알아서 socket.io를 실행하고 있는 서버를 찾음 
const socket = io();

// welcome 가져오기
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

// room 숨기기
room.hidden = true;

let roomName;

// 화면에 메시지를 추가하는 함수
function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);    
}

// 메시지를 제출하는 함수
function handlerMessageSubmit (event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

//닉네임 저장 함수
function handlerNicknameSubmit (event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}

// room을 보여주는 함수
function showRoom(msg) {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`

    // 메시지 보내기
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handlerMessageSubmit);
    nameForm.addEventListener("submit", handlerNicknameSubmit);
}

// submit버튼이 눌렸을 때 함수
function handleRoomSubmit(event){
    event.preventDefault();
    const roomInput = form.querySelector("#roomName");
    //닉네임 전송
    const nickInput = form.querySelector("#nick");

    socket.emit("enter_room", roomInput.value, nickInput.value, showRoom);
    roomName = roomInput.value;
    roomInput.value="";
}

//room user 카운트 함수
function roomCount(roomName, newCount) {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`
}

form.addEventListener("submit", handleRoomSubmit);

// room 입장 시
socket.on("welcome", (user, newCount) => {
    roomCount(roomName, newCount);
    addMessage(`${user} arrived!`);
});

// room 퇴장 시
socket.on("bye", (left, newCount) => {
    roomCount(roomName, newCount);
    addMessage(`${left} left ㅠㅠ`);
});

// 메시지 도착 시
socket.on("new_message", addMessage);

// 새로운 public 룸 생성 시 알림
// == socket.on("room_change", (msg) => console.log(msg));
// socket.on("room_change", console.log);
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    //room이 하나도 없을 때
    roomList.innerHTML = "";
    if(rooms.length === 0) {
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});
