from flask import Flask, url_for, request, redirect, render_template
import requests

app = Flask(__name__)

@app.route("/")
def index():
    error = None
    return render_template('index.html', error=error)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)