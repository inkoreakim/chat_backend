let stompClient = null;
let username = "user_" + Math.floor(Math.random() * 100);

function connect () {
    let socket = new SockJS('/ws/chat')
    stompClient = Stomp.over(socket);

    // 2. 연결 시도
    stompClient.connect({}, onConnected, onError);
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

function onError(error) {
    console.error('WebSocket 연결 오류:', error);
}

function sendMessage() {
    var messageContent = document.getElementById('messageInput').value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };
        // 5. 서버로 메시지 전송
        // ChatController의 @MessageMapping("/chat/message")와 일치해야 합니다.
        stompClient.send("/app/chat/message", {}, JSON.stringify(chatMessage));
        document.getElementById('messageInput').value = '';
    }
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    // 6. 받은 메시지를 화면에 표시
    var messageElement = document.createElement('li');
    messageElement.textContent = message.sender + ': ' + message.content;
    document.getElementById('messages').appendChild(messageElement);
}

// 페이지 로드 시 연결 시작
connect();