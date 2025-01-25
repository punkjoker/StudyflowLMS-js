from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
from flask_cors import CORS
import torch
from datasets import load_dataset

app = Flask(__name__)

# Enable CORS for all routes or specific origins
CORS(app, resources={r"/chat": {"origins": "http://localhost:3000"}})

# Load the DialoGPT model and tokenizer
model_name = "microsoft/DialoGPT-medium"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Optionally, load a dataset (like DailyDialog) for conversation context
dataset = load_dataset("daily_dialog", trust_remote_code=True)
train_data = dataset['train']  # Use the training data or any subset you need

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "")
    if not user_input:
        return jsonify({"response": "Please provide a message."})

    # Tokenize input and generate response
    inputs = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors="pt")
    
    # Generate response with attention mask to handle pad tokens properly
    attention_mask = torch.ones(inputs.shape, dtype=torch.long)  # Creating attention mask
    
    # Generate a response
    outputs = model.generate(
        inputs, 
        max_length=1000, 
        pad_token_id=tokenizer.eos_token_id,
        attention_mask=attention_mask
    )
    
    # Extract the generated response (after input tokens)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # You can also add custom logic using the dataset, for example:
    # Find a response from the DailyDialog dataset that matches the user's input
    # For now, just return the model's response
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
