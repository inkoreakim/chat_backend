let stompClient = null;
let username = "user_" + Math.floor(Math.random() * 100);

function connect () {
    // SockJS 객체 생성 및 엔드포인트 연결
    // WebSocketCOnfig 에서 등록한 endpoint 와 일치해야함
    let socket = new SockJS('/ws/chat')
    // STOMP 클라이언트 생성
    stompClient = Stomp.over(socket);

    // 연결 시도
    // {}: 연결 시 전달할 STOMP 헤더, success 콜백함수, error 콜백함수
    stompClient.connect({}, onConnected, onError);
}

function onConnected() {
    console.log('WebSocket 연결 성공');

    // 메시지를 받을 채널 구독
    // ChatController의 @SendTo("/topic/public")과 일치해야 함.
    stompClient.subscribe('/topic/public', onMessageReceived);

    // 접속 메시지 서버로 전송 (선택 사항)
    // /app --> Prefix
    stompClient.send("/app/chat/message",
        {},
        JSON.stringify({sender: username, type: 'JOIN', content: '접속했습니다!'})
    );
}

function onError(error) {
    console.error('WebSocket 연결 오류:', error);
}

function sendMessage() {
    let messageContent = document.getElementById('messageInput').value.trim();
    if(messageContent && stompClient) {
        let chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };
        // 서버로 메시지 전송
        // ChatController의 @MessageMapping("/chat/message")와 일치해야함
        stompClient.send("/app/chat/message", {}, JSON.stringify(chatMessage));
        document.getElementById('messageInput').value = '';
    }
}

function onMessageReceived(payload) {
    let message = JSON.parse(payload.body);
    const messages = document.getElementById('messages');
    // 메시지를 담을 최상위 div 요소 생성
    const chatContainer = document.createElement('div');

    // 아이콘 div와 텍스트 박스 div 생성
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('icon');
    iconDiv.innerHTML = '<i class="fa-solid fa-user"></i>';

    const textboxDiv = document.createElement('div');

    if (message.type === 'JOIN') {
        chatContainer.classList.add('system-message');
        textboxDiv.classList.add('message-text');
        textboxDiv.textContent = `${message.sender} 님이 접속했습니다.`;
        chatContainer.appendChild(textboxDiv);
    } else if (message.type === 'CHAT') {
        chatContainer.classList.add('chat'); // chat 클래스 필수
        textboxDiv.classList.add('textbox'); // textbox 클래스 필수
        textboxDiv.textContent = message.content;

        if (message.sender === username) {
            // 나의 메시지 (ch2)
            chatContainer.classList.add('ch2');
            chatContainer.appendChild(iconDiv);
            chatContainer.appendChild(textboxDiv);
        } else {
            // 상대방 메시지 (ch1)
            chatContainer.classList.add('ch1');
            chatContainer.appendChild(iconDiv);
            chatContainer.appendChild(textboxDiv);
        }
    }
    messages.appendChild(chatContainer);
    messages.scrollTop = messages.scrollHeight;
}

// 페이지 로드 시 연결 시작
connect();