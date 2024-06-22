import os
from groq import Groq
from flask import Flask, request, json

client = Groq(
    api_key="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"
)

# audio path
# filename = "C:\Users\darsh\OneDrive\Documents\Sound recordings\Recording.m4a"
filename = "C:\\Users\\keyon\\OneDrive\\Documents\\Sound Recordings\\Recording.m4a"

with open(filename, "rb") as file:
    transcription = client.audio.transcriptions.create(
      file=(filename, file.read()),
      model="whisper-large-v3",
      prompt="Specify context or spelling",  # Optional
      response_format="json",  # Optional
      language="en",  # Optional
      temperature=0.0  # Optional
    )
    print(transcription.text)

# Create flask app
app = Flask(__name__)

# create endpoint
@app.route('/speechToText', methods=['POST'])
def speech_to_text():
    with open(filename, "rb") as file:
        transcription = client.audio.transcriptions.create(
            file=(filename, file.read()),
            model="whisper-large-v3",
            prompt="Specify context or spelling",  # Optional
            response_format="json",  # Optional
            language="en",  # Optional
            temperature=0.0  # Optional
        )
    return transcription.text

if __name__ == '__main__':
    app.run(debug=True)