from flask import Flask
from flask import render_template

# Creates a Flask application called 'app'
app = Flask(__name__, template_folder='C:\Users\jwhitehead\Documents\Webdev\Angular Web App')

# The route to display the HTML template on
@app.route('/')
def host():
    return render_template('index.html')

# Run the Flask application
if __name__ == "__main__":
    app.run(host='localhost', port='80')
