# using flask_restful
import os
from flask import Flask, jsonify, flash, request, redirect, url_for
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from werkzeug.utils import secure_filename
import numpy as np
import fitz
import openai

# creating the flask app
app = Flask(__name__)
cors = CORS(app)

# creating an API object
api = Api(app)
UPLOAD_FOLDER = 'C:/Users/mehek/finovate-git-rpo/WiT-Finovate/back-end/FileDB'
ALLOWED_EXTENSIONS = set(['pdf'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

paperContent = ''
summary = []
allSummaryText = ''

@cross_origin()
def pdfToTextUtil(fileName):
    filePath =r"C:\Users\mehek\finovate-git-rpo\WiT-Finovate\back-end\FileDB" +'\\' + fileName 
    print('def',filePath)
    global paperContent
    global summary
    summary = []
    global allSummaryText
    paperContent = ''
    paperContent = fitz.open(filePath)
    tldr_tag = "\n Tl;dr:"
    openai.organization = "org-dgNcRwMlJXr3DYN3pet7mjTO"
    openai.api_key = "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"
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
        if(index <= 10):
            allSummaryText += ' '+ response["choices"][0]["text"]
        
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

  
# making a class for a particular resource
# the get, post methods correspond to get and post requests
# they are automatically mapped by flask_restful.
# other methods include put, delete, etc.
class Hello(Resource):
  
    # corresponds to the GET request.
    # this function is called whenever there
    # is a GET request for this resource
    def get(self):
  
        return jsonify({'message': 'hello world'})
  
    # Corresponds to POST request
    @cross_origin()
    @app.route('/upload', methods=['POST'])
    def upload_file():
        if request.method == 'POST':
            # check if the post request has the file part
            file = request.files['file']
            # if user does not select file, browser also
            # submit an empty part without filename
            if file.filename == '':
                flash('No selected file')
                return jsonify({'msg': 'no file received'})
            if file and file.filename != '':
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                completeSummary = pdfToTextUtil(filename)
                print('ans',completeSummary)
                return jsonify({'summaryOfFile': summary})
        return jsonify({'msg': 'response from server'})
  
    def allowed_file(filename):
        return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    
    
    
api.add_resource(Hello, '/');

# driver function
if __name__ == '__main__':
    app.run(debug = True) 
    # app.run(host="0.0.0.0")
