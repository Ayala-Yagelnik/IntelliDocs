from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils.detect_file_type import detect_file_type
from utils.summarize_text import summarize_text_file
from utils.summarize_image import summarize_image_file
from utils.transcribe_audio import transcribe_audio_file
from utils.analyze_video import analyze_video_file
import tempfile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/summarize/")
async def summarize(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        file_type = detect_file_type(tmp_path)

        if file_type == "text":
            result = summarize_text_file(tmp_path)
        elif file_type == "image":
            result = summarize_image_file(tmp_path)
        elif file_type == "audio":
            result = transcribe_audio_file(tmp_path)
        elif file_type == "video":
            result = analyze_video_file(tmp_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        return {"type": file_type, "summary": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
