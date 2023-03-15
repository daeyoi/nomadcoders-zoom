const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

//frontEnd와 backEnd 소켓 연결
//window.location.host: 현재 host 주소
const socket = new WebSocket(`ws://${window.location.host}`);

//JSON -> String
function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

//socket이 connection을 open 했을 때
socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});

//메시지 받아서 화면에 노출
socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

//connection 종료
socket.addEventListener("close", () => {
    console.log("Disconnected form Server ❌");
});


//메시지 제출 리슨 핸들러
function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    //내 메시지 보이기 
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    
    input.value = "";
}

//닉네임 저장 핸들러
function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
}
nickForm.addEventListener("submit", handleNickSubmit);
messageForm.addEventListener("submit", handleSubmit);