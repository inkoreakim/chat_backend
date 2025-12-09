package org.chat_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // 1. WebSocket 접속을 위한 엔드포인트 등록
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 클라이언트가 SockJS를 사용하여 /ws/chat 경로로 WebSocket 연결을 시작할 수 있도록 합니다.
        // **SockJS**는 WebSocket을 지원하지 않는 브라우저를 위해 Fallback 옵션을 제공합니다.
        // 운영 환경에서는 특정 도메인만 CORS 허용
        registry.addEndpoint("/ws/chat").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 클라이언트에게 메시지를 전달할 때 사용할 Prefix를 정의합니다.
        // 즉, "/topic"으로 시작하는 경로를 구독(subscribe)하는 클라이언트들에게 메시지가 전달됩니다.
        registry.enableSimpleBroker("/topic");

        // 클라이언트가 서버로 메시지를 보낼 때 사용할 목적지(Destination) Prefix를 정의합니다.
        // 예를 들어, 클라이언트가 "/app/chat/message"로 메시지를 보내면,
        // 이 메시지는 @MessageMapping("/chat/message")가 붙은 Controller로 라우팅됩니다.
        registry.setApplicationDestinationPrefixes("/app");
    }
}
