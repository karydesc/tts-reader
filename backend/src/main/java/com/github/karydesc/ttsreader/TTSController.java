package com.github.karydesc.ttsreader;

import org.pitest.voices.audio.Audio;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@RestController
@CrossOrigin(origins = "*")
public class TTSController {

    private final SpeechService speechService = new SpeechService();

    @GetMapping("/api/tts/generate")
    public ResponseEntity<StreamingResponseBody> generate(
            @RequestParam String text)
    {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("audio/mp3"));

        final Audio generatedAudioBytes = speechService.generate(text);

        StreamingResponseBody responseBody = generatedAudioBytes::save;

        return new ResponseEntity<>(responseBody, headers, HttpStatus.OK);
    }
//
//    @GetMapping("/api/tts/voices")
//    public ResponseEntity<StreamingResponseBody> getVoices(
//            @RequestParam String language
//    ){
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.valueOf("application/json)"));
//
//
//    }

}