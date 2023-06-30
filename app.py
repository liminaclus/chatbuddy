from flask import Flask, render_template, request
from gpt4all import GPT4All
import os

app = Flask(__name__)

model_path = "models"
model_name = "ggml-gpt4all-j-v1.3-groovy"
model_file = os.path.join(model_path, (model_name+'.bin'))
if not os.path.exists(model_file):
    GPT4All.download_model(model_filename='ggml-gpt4all-j-v1.3-groovy.bin', model_path=model_path, verbose=True, url='https://gpt4all.io/models/ggml-gpt4all-j-v1.3-groovy.bin')

gptj = GPT4All("ggml-gpt4all-j-v1.3-groovy", model_path=model_path)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    message = request.form["message"]

    messages = [{"role": "user", "content": message}]
    response = gptj.chat_completion(messages=messages, verbose=False, streaming=False)

    reply = response['choices'][0]['message']['content']
    reply = reply.strip()

    return {"message": reply}


if __name__ == "__main__":
    app.run()
