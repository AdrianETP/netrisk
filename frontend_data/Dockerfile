FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# Expose the port your app will use
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]

