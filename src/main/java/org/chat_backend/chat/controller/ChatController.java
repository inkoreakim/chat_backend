package org.chat_backend.chat.controller;

import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.chat_backend.chat.dto.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@Controller
@NoArgsConstructor
public class ChatController {

    @GetMapping("/get")
    public String get() {
        log.info("get");
        return "return";
    }

    @MessageMapping("/chat/message")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        log.info("{} : '{}'", chatMessage.getSender(), chatMessage.getContent());
        return chatMessage;
    }
}
