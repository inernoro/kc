FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN npm run build

FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV API_PORT=10255

COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js ./
COPY --from=build /app/build ./build

EXPOSE 10255
CMD ["node", "server.js"]
