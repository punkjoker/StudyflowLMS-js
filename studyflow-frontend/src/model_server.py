from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import re
import logging

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/chat": {"origins": "http://localhost:3000"}})

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Enhanced function to clean terminal control characters
def clean_output(output):
    ansi_escape = re.compile(r'\x1b(?:[@-_]|[0-?]*[ -/]*[@-~])')
    cursor_controls = re.compile(r'\?25[hl]|\x1b\[2K|\x1b\[1G')
    spinner_symbols = re.compile(r'[⠋⠙⠸⠼⠴⠦⠧⠇⠏]')
    output = ansi_escape.sub('', output)
    output = cursor_controls.sub('', output)
    output = spinner_symbols.sub('', output)
    output = re.sub(r'\s+', ' ', output).strip()
    return output

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "").strip()
    if not user_input:
        return jsonify({"status": "error", "message": "Please provide a message."}), 400

    try:
        process = subprocess.Popen(
            ["ollama", "run", "llama2"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = process.communicate(input=user_input + '\n', timeout=30)

        if stderr.strip():
            cleaned_error = clean_output(stderr.strip())
            app.logger.error(f"Subprocess error: {cleaned_error}")
            return jsonify({"status": "error", "message": f"Error occurred: {cleaned_error}"}), 500

        cleaned_response = clean_output(stdout.strip())
        return jsonify({"status": "success", "data": {"response": cleaned_response}})

    except subprocess.TimeoutExpired:
        process.kill()
        return jsonify({"status": "error", "message": "The request timed out."}), 504

    except Exception as e:
        app.logger.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({"status": "error", "message": f"An error occurred: {str(e)}"}), 500

@app.route("/health", methods=["GET"])
def health():
    try:
        process = subprocess.Popen(
            ["ollama", "--version"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = process.communicate(timeout=10)

        if process.returncode == 0:
            return jsonify({"status": "success", "message": "Server is running and Ollama is accessible."})
        else:
            cleaned_error = clean_output(stderr.strip())
            return jsonify({"status": "error", "message": f"Ollama check failed: {cleaned_error}"}), 500

    except subprocess.TimeoutExpired:
        return jsonify({"status": "error", "message": "Health check timed out."}), 504

    except Exception as e:
        return jsonify({"status": "error", "message": f"An error occurred during health check: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
