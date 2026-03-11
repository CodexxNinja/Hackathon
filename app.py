from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/greet', methods=['POST'])
def greet():
    # This gets the 'username' from the form input
    name = request.form.get('username')
    return render_template('greet.html', user_name=name)

if __name__ == '__main__':
    app.run(debug=True, port=5001)