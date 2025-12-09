document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('test_button').onclick = () => {
        window.open('http://localhost:8080',  'myPopup');
    }
});

let stompClient = null;
let username = "user_" + Math.floor(Math.random() * 100);

function connect () {
    let socket = new SockJS('/ws/chat')
    stompClient = Stomp.over(socket);
}

function onConnected() {
    console.log('WebSocket 연결 성공');

    // 3. 메시지를 받을 채널 구독
    // ChatController의 @SendTo("/topic/public")과 일치해야 합니다.
    stompClient.subscribe('/topic/public', onMessageReceived);

    // 4. 접속 메시지 서버로 전송 (선택 사항)
    stompClient.send("/app/chat/message",
        {},
        JSON.stringify({sender: username, type: 'JOIN', content: '접속했습니다!'})
    );
}