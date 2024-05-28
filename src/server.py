import logging
import sys
from langchain_openai import AzureChatOpenAI
from langchain_core.messages import HumanMessage
from flask import Flask
from dotenv import load_dotenv

load_dotenv('..')

app = Flask(__name__)

model = AzureChatOpenAI(
    api_version="2023-12-01-preview",
    deployment_name="gpt-35-turbo-1106"
)

@app.route("/")
def hello_world():
    message = HumanMessage(
        content="Say hello world as a pirate"
    )
    response = model.invoke([message])
    return response.content
