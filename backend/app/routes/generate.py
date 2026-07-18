import json

from flask import Blueprint, request, send_file, jsonify
from app.VoiceService import VoiceService

tts_bp = Blueprint('tts', __name__, url_prefix='/api')
voice_service = VoiceService()
voice_service.scan_voices()

@tts_bp.route('tts/generate', methods=['GET'])
def stream_tts():
    text = request.args.get('text', '')
    voice = request.args.get('voice', '')

    if not text:
        return jsonify({"error": "text parameter is required"}), 400

    if not voice:
        voice = list(voice_service.voices.keys())[0] if voice_service.voices else None
        if not voice:
            return jsonify({"error": "no voices available on server"}), 500

    wav_path = "../"+voice_service.generate_audio(voice, text)
    if not wav_path:
        return jsonify({"error": "voice not found"}), 404

    return send_file(wav_path, mimetype='audio/wav')


@tts_bp.route('tts/voices', methods=['GET'])
def get_all_voices():
    # serialize a list of voice objects
    voice_list = [v.to_dict() for v in voice_service.voices.values()]
    return jsonify(voice_list)
