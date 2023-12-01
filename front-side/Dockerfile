FROM node:20.9.0

WORKDIR /workspace

COPY front_app/package*.json /workspace/
RUN npm install
RUN npm install axios
RUN npm install react-router-dom
RUN npm install --save-dev @types/react-router-dom
