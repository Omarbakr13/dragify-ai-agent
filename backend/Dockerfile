FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy only requirements first for better caching
COPY backend/requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the backend code
COPY backend/ .

# Expose the port (Railway will set $PORT)
EXPOSE 8000

# Use $PORT if set, otherwise default to 8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
