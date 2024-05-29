import logging
import sys
from langchain_openai import AzureChatOpenAI
from langchain_core.messages import HumanMessage
from flask import Flask
from dotenv import load_dotenv
from flask import request

load_dotenv('..')

app = Flask(__name__)


@app.route("/chat", methods=["POST"])
def hello_world():
    req_json = request.get_json()
    messages = req_json["messages"]
    messages.append({"message": "test", "type": "assistant"})
    return messages
