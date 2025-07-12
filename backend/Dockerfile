# Use official lightweight Python image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy your FastAPI backend code into the container
COPY backend/ .

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Expose port 8000 (Railway will map it to a public one)
EXPOSE 8000

# Start the FastAPI app with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
