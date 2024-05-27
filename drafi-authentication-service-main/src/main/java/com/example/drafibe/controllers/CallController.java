package com.example.drafibe.controllers;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping
public class CallController {

//    @GetMapping("/room_create")
    @PostMapping("/room_create")
    public String roomCreate(@RequestBody Map<Object, Object> body) {
        System.out.println("ROOM_CREATE");
        System.out.println(body);
        return "room_create";
    }

//    @GetMapping("/room_close")
    @PostMapping("/room_close")
    public String roomClose(@RequestBody Map<Object, Object> body) {
        System.out.println("ROOM_CLOSE");
        System.out.println(body);
        return "room_close";
    }

//    @GetMapping("/room_logged_in")
    @PostMapping("/room_logged_in")
    public String roomLoggedIn(@RequestBody Map<Object, Object> body) {
        System.out.println("ROOM_LOGGED_IN");
        System.out.println(body);
        return "room_logged_in";
    }

//    @GetMapping("/room_logged_out")
    @PostMapping("/room_logged_out")
    public String roomLoggedOut(@RequestBody Map<Object, Object> body) {
        System.out.println("ROOM_LOGGED_OUT");
        System.out.println(body);
        return "room_logged_out";
    }

}
