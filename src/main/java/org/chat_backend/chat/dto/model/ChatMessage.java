package org.chat_backend.chat.dto.model;

import lombok.Getter;
import lombok.Setter;
import org.chat_backend.common.enums.MessageType;

@Getter
@Setter
public class ChatMessage {
    private Long roomId;
    private String sender;
    private String content;
    private MessageType messageType;
}
