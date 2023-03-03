# using flask_restful
import os
from flask import Flask, jsonify, flash, request, redirect, url_for
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from werkzeug.utils import secure_filename
import numpy as np
import fitz
import openai
from fpdf import FPDF
import json
from azure.storage.blob import BlobServiceClient

# creating the flask app
app = Flask(__name__)
cors = CORS(app)

# creating an API object
api = Api(app)
UPLOAD_FOLDER = 'E:\gpt3-summarization\FileDB'
ALLOWED_EXTENSIONS = set(['pdf'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


storage_account_key = ""
storage_account_name = ""
connection_string = ""
container_name = "fileholder"



@cross_origin()
def uploadToBlobStorage(file_path, file_name):
    blob_service_client = BlobServiceClient.from_connection_string(connection_string);
    blob_client = BlobServiceClient.get_blob_client(blob_service_client,container=container_name, blob=file_name)

    with open(file_path, "rb") as data:
        blob_client.upload_blob(data,overwrite=True)
    print("Uploaded "+file_name+" file.")
    return jsonify({'summaryPerPage': 'Passed'})

@cross_origin()
def textToPDF(filename,text):
    pdf = FPDF()
    pdf.add_page()
    text2 = text.encode('latin-1', 'replace').decode('latin-1')
    pdf.set_font("Arial", size = 15)
    pdf.write(8, txt=text2)
    pdf.ln(8)
    pdf.output(filename, 'F')
    return jsonify({'summaryPerPage': 'Passed'})
        
@cross_origin()
def pdfToTextUtil(fileName):
    filePath =r"E:\\gpt3-summarization\\FileDB" +'\\' + fileName 
    print('def',filePath)
    global paperContent
    global summary
    summary = []
    allSummaryText = ''
    paperContent = ''
    paperContent = fitz.open(filePath)
    tldr_tag = "\n Tl;dr:"
    openai.organization = "org-dgNcRwMlJXr3DYN3pet7mjTO"
    openai.api_key = ""
    engine_list = openai.Engine.list() 
    index = 1  
    for page in paperContent:
        text = page.get_text("text") + tldr_tag
        response = openai.Completion.create(model="text-davinci-003",prompt=text,temperature=0.9,
            max_tokens=140,
            top_p=0.9,
            frequency_penalty=0.0,
            presence_penalty=1
            # stop=["\n"]
        )
        summary.append(response["choices"][0]["text"])
        if(index <= 5):
            allSummaryText += response["choices"][0]["text"]
        
        index += 1

    text = "What is the sentiment of given text: "+ allSummaryText+ tldr_tag
    sentimentResponse = openai.Completion.create(model="text-curie-001",prompt=text,temperature=0.8,
        max_tokens=140,
        top_p=0.9,
        frequency_penalty=0.0,
        presence_penalty=1
        # stop=["\n"]
    )
    summary.append(sentimentResponse["choices"][0]["text"])
    return jsonify({'summaryPerPage': 'Passed'})


  
   
