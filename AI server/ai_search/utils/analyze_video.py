import cv2

def analyze_video_file(filepath):
    cap = cv2.VideoCapture(filepath)
    if not cap.isOpened():
        return "Cannot open video file."

    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = frame_count / cap.get(cv2.CAP_PROP_FPS)
    width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    cap.release()

    return f"Video duration: {duration:.2f}s, resolution: {int(width)}x{int(height)}, frames: {frame_count}"
