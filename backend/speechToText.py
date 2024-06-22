import os
from groq import Groq
from flask import Flask, request, json
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

client = Groq(
    api_key="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"
)

# create endpoint

@app.route('/speechToText', methods=['POST'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def speech_to_text():
    audio = request.files['audio']
    print("got audio file ",audio)
    with (audio) as file:
        transcription = client.audio.transcriptions.create(
            file=(file, file.read()),
            model="whisper-large-v3",
            prompt="Specify context or spelling",  # Optional
            response_format="json",  # Optional
            language="en",  # Optional
            temperature=0.0  # Optional
        )
    return transcription.text


@app.route("/test", methods=['GET'])
def test():
    return "Hello World!"

if __name__ == '__main__':
    app.run(debug=True)