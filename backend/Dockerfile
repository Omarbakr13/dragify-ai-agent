# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy backend code
COPY backend/ .

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Expose port (Railway will override it)
EXPOSE 8000

# Start FastAPI app using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
