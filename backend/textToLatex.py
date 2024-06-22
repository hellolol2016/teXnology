import os
from groq import Groq
from flask import Flask, request, jsonify

# Setup groq client
client = Groq(
    api_key="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"
)

# Set system prompt
system_message = {
    'role' : 'system',
    'content' : 
    # Paste system prompt here
    '''
    convert this text to latex. eliminate redundant phrases as necessary. 
    return only the latex code. don't say "here is the equivalent latex code" or qualify the statement in any way.
    '''
}


# Create flask app
app = Flask(__name__)

# Create endpoint for groq API call
@app.route('/textToLatex', methods=['POST'])
def text_to_latex():
    user_prompt = request.json['prompt']
    user_message = {
        'role' : 'user',
        'content' : user_prompt
    }
    messages = [system_message, user_message]
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama3-8b-8192"
    )
    return jsonify({'response': chat_completion.choices[0].message.content})

if __name__ == '__main__':
    app.run(debug=True)