import whisper

model = whisper.load_model("base")

def transcribe_audio_file(filepath):
    result = model.transcribe(filepath)
    return result.get("text", "No transcription available.")
