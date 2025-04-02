FROM node:22

WORKDIR /app

ADD . /app

# Install dependencies
RUN npm ci \
  --omit dev \
  --no-fund \
  --no-audit

CMD ["npm", "start"]
