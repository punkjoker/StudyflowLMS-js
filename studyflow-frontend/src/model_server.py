from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import requests
import logging
import json

app = Flask(__name__)

# Enable CORS for frontend requests
CORS(app, resources={r"/chat": {"origins": "http://localhost:3000"}})

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

OLLAMA_API_URL = "http://localhost:11434/api/generate"  # Ollama API endpoint

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "").strip()

    if not user_input:
        return jsonify({"status": "error", "message": "Please provide a message."}), 400

    def generate_response():
        try:
            response = requests.post(
                OLLAMA_API_URL,
                json={"model": "llama2", "prompt": user_input},
                stream=True
            )

            if response.status_code != 200:
                logging.error(f"Ollama API returned an error: {response.status_code} - {response.text}")
                yield json.dumps({"status": "error", "message": "Ollama API returned an error."}) + "\n"
                return

            # Stream the response line by line
            for chunk in response.iter_lines():
                if chunk:
                    try:
                        chunk_data = chunk.decode("utf-8")
                        response_data = json.loads(chunk_data)
                        if "response" in response_data:
                            yield json.dumps({"status": "stream", "data": response_data["response"]}) + "\n"
                    except json.JSONDecodeError as e:
                        logging.error(f"JSON decoding error in chunk: {e}")
                        continue
                    except Exception as e:
                        logging.error(f"Unexpected error processing chunk: {e}")
                        continue

            yield json.dumps({"status": "success", "message": "Response completed"}) + "\n"

        except requests.RequestException as e:
            logging.error(f"Ollama API request failed: {str(e)}")
            yield json.dumps({"status": "error", "message": "Failed to communicate with Ollama API."}) + "\n"

    return Response(generate_response(), content_type="application/json")

@app.route("/health", methods=["GET"])
def health():
    try:
        response = requests.get("http://localhost:11434/api/status")
        if response.status_code == 200:
            return jsonify({"status": "success", "message": "Ollama API is running."})
        else:
            logging.error(f"Ollama API health check failed: {response.status_code}")
            return jsonify({"status": "error", "message": "Ollama API is not responding."}), 500
    except requests.RequestException as e:
        logging.error(f"Health check failed: {str(e)}")
        return jsonify({"status": "error", "message": "Could not reach Ollama API."}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
