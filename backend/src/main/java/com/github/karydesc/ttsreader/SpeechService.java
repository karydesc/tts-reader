package com.github.karydesc.ttsreader;

import org.pitest.voices.Chorus;
import org.pitest.voices.ChorusConfig;
import org.pitest.voices.Voice;
import org.pitest.voices.alba.Alba;
import org.pitest.voices.audio.Audio;
import org.pitest.voices.uk.EnUkDictionary;
import static org.pitest.voices.ChorusConfig.chorusConfig;

public class SpeechService {
    ChorusConfig config = chorusConfig(EnUkDictionary.en_uk());

   Chorus chorus = new Chorus(config);
    public Audio generate(String text) {
            Voice alba = chorus.voice(Alba.albaMedium());
            Audio audio = alba.say(text);
            return audio;
    }
}