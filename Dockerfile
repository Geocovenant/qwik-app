ARG NODE_VERSION=18.18.2

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.pnpm to speed up subsequent builds.
# Leverage bind mounts to package.json and pnpm.lock to avoid having to copy them
# into this layer.
RUN npm install -g pnpm

COPY package.json .
RUN pnpm install

################################################################################
# Create a stage for building the application.
FROM deps as build

# Copy the rest of the source files into the image.
COPY . .

# Run the build script.
RUN pnpm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV production
ENV ORIGIN https://qwik-app-production-cb35.up.railway.app

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/server ./server

ENV DOCKER=true

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm serve