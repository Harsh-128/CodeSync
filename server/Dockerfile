FROM node:22-slim

# Install compilers and runtimes needed for code execution
RUN apt-get update && apt-get install -y \
    g++ \
    python3 \
    default-jdk \
    && ln -sf /usr/bin/python3 /usr/bin/python \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
