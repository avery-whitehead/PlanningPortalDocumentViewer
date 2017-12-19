import os, sys, time, shutil, json, ast
from flask import Flask, render_template, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename

dir_path = '//ccvuni01/PlanningPortal/_ToIndex'
UPLOAD_FOLDER = '/docs/'
ALLOWED_EXTENSIONS = set(['pdf', 'jpg', 'jpeg', 'png'])

# Creates a Flask application called 'app'
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Gets the un-indexed applications
def get_path_ref():
    # Gets a list of directories in the path
    ref_dirs = [stats for stats in os.listdir(dir_path) if os.path.isdir(os.path.join(dir_path, stats))]
    # Sorts them by the last modified time (most recent first)
    ref_dirs.sort(key = lambda stats: os.path.getmtime(os.path.join(dir_path, stats)), reverse = True)
    return ref_dirs

# Converts a list of documents to a JSON array
def docs_to_json(doc_list):
    no_ext_list = []
    doc_list = os.listdir('static/docs')
    for doc in doc_list:
        # Removes file extensions
        no_ext_list.append(os.path.splitext(doc)[0])
    # Adds the URL path prefix
    doc_list = ['/static/docs/' + doc for doc in doc_list]
    # Converts to a JSON array
    json_list = [{'name': name, 'path': path} for name, path in zip(no_ext_list, doc_list)]
    return json.dumps(json_list, sort_keys=True)

# Displays index.html
@app.route('/')
def host():
    references = get_path_ref()
    # Clear static/docs folder
    local_doc_path = 'static/docs/'
    for local_doc in os.listdir(local_doc_path):
        os.remove(local_doc_path + local_doc)
    # Passes a list of references to the HTML/JS
    return render_template('index.html', references=', '.join(get_path_ref()))

# Invisible redirect for giving Flask the reference search resutlt
@app.route('/<int:ref_id>')
def get_docs(ref_id):
    ref_string = str(ref_id)
    local_doc_path = 'static/docs/'
    remote_doc_path = '//ccvuni01/PlanningPortal/_ToIndex/' + ref_string + '/Attachments'
    # Clear static/docs folder
    for local_doc in os.listdir(local_doc_path):
        os.remove(local_doc_path + local_doc)
    # Copy remote docs to static/docs
    for remote_doc in os.listdir(remote_doc_path):
        full_path = os.path.join(remote_doc_path, remote_doc)
        if (os.path.isfile(full_path)):
            shutil.copy(full_path, local_doc_path)
    docs_to_json(os.listdir(local_doc_path))
    # Return the reference search result
    return docs_to_json(os.listdir(local_doc_path))

@app.route('/message', methods=['POST'])
def handle_messsage():
    # Strip any Unicode "u'"s from the data and convert to JSON
    data = ast.literal_eval(json.dumps(request.json))
    # Build the mail message
    message = 'Name: %s\nEmail: %s\nMessage: %s' % (data['name'], data['email'], data['message'])
    print message
    #loc = 'logs/%s' % data.name
    #try:
        #file = open('logs/')


    return jsonify(request.json)


# Run the Flask application
if __name__ == '__main__':
    app.run(host='localhost', port='80')
