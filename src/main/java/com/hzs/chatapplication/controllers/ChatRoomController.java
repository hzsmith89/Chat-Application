package com.hzs.chatapplication.controllers;

import com.hzs.chatapplication.bo.Message;
import lombok.extern.slf4j.Slf4j;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class ChatRoomController {

    @MessageMapping("/{roomName}")
    @SendTo("/chat/{roomName}")
    public Message sendChat(@DestinationVariable String roomName, Message message) {
        log.info("Room: " + roomName);
        log.info(String.valueOf(message));
        return message;
    }
}
