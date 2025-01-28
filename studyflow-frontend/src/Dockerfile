FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip

# Install Ollama CLI
RUN curl -fsSL https://ollama.com/install.sh | bash

# Set Ollama as the entrypoint
ENTRYPOINT ["ollama"]

