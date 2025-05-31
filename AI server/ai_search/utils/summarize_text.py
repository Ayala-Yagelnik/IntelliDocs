# from transformers import pipeline

# summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()

    if len(text.strip()) == 0:
        return "Empty text file."

    summary = ""
    return summary
