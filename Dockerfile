FROM node:16.1.0
ENV NODE_ENV production
WORKDIR /app
RUN npm i -g pm2
COPY package*.json process.yml ./
COPY ./ ./
# Switch to user node
# USER node

# Install libraries as user node
RUN npm i --only=production

# Open desired port
EXPOSE 3000

# Use PM2 to run the application as stated in config file
ENTRYPOINT ["pm2-runtime", "./process.yml"] 