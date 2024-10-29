# Dockerfile for React app
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 


COPY . .

# Expose the port your app runs on
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev"]
