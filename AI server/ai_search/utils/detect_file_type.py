import mimetypes

def detect_file_type(filepath):
    mime, _ = mimetypes.guess_type(filepath)

    if mime is None:
        return "unknown"

    if mime.startswith("text"):
        return "text"
    elif mime.startswith("image"):
        return "image"
    elif mime.startswith("audio"):
        return "audio"
    elif mime.startswith("video"):
        return "video"
    else:
        return "unknown"
