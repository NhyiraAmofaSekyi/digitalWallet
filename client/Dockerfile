# Stage 1: Build the React app
FROM node:20 AS build

WORKDIR /app

# Copy package.json and yarn.lock instead of npm files
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the project files
COPY . .

# Build the application
ARG VITE_API_URL
ARG VITE_WS
ARG VITE_PORT
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_WS=${VITE_WS}
ENV VITE_PORT=${VITE_PORT}

RUN yarn build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Set environment variables
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_WS=${VITE_WS}

# Copy built app to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Remove default Nginx config and add our own
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
