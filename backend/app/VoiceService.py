from piper import PiperVoice
from app.models import Voice
import os
import wave
import hashlib

class VoiceService:
    def __init__(self):
        self.voices = {}

    def scan_voices(self, rootdir='/Users/chris/piper-voices'):
        i = 0
        for subdir, _, files in os.walk(rootdir):
            for file in files:
                if file.endswith(".onnx"):
                    filename_clean, _ = os.path.splitext(file)
                    parts = filename_clean.split("-")

                    if len(parts) >= 3:
                        lang = parts[0].split("_")[0]
                        name = parts[1]
                        quality = parts[2]

                        full_path = os.path.join(subdir, file)
                        self.voices[name] = Voice(name, lang, full_path, quality, i)
                        i += 1

    def get_voices(self, quality='any', language='any'):
        filtered = {}
        for voice in self.voices.values():
            if (voice.quality == quality or quality == 'any') and (voice.language == language or language == 'any'):
                filtered[voice.name] = voice
        return filtered

    def generate_audio(self, voice_name, text):
        if len(os.listdir("./out")) >= 30:
            for file in os.listdir("./out"):
                os.remove("./out/" + file)

        if not self.voices.get(voice_name):
            return None
        else:
            filehash = hashlib.md5(text.encode('utf-8')).hexdigest()
            # check if hashed audio file exists with the same text
            if filehash in os.listdir("./out"):
                return f"out/{filehash}.wav"

            voice = PiperVoice.load(self.voices[voice_name].path)
            with wave.open(f"./out/{filehash}{voice_name}.wav", "wb") as wav_file:
                voice.synthesize_wav(text, wav_file)
                return f"out/{filehash}{voice_name}.wav"