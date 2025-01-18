FROM denoland/deno:2.1.6

# Set the working directory in the container
WORKDIR /app

# Copy the backend source code to the container
COPY ./backend ./backend

# Expose the backend port (adjust if necessary)
EXPOSE 8000

# Command to run the app
CMD ["run", "--env", "--allow-env", "--allow-net", "--allow-read", "--allow-write", "./backend/start.ts"]
