FROM python:3.11-slim

WORKDIR /app

# Copy only requirements for caching
COPY backend/requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the app
COPY backend/ .

# Expose port
EXPOSE 8000

# Default to port 8000 if $PORT not set
ENV PORT=8000

# Final correct CMD: no shell tricks
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
