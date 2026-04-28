# ── Stage 1: Build/install dependencies ──────────────────────────────────────
# Use Python 3.12 — 3.13+ breaks Pillow/EasyOCR source builds
FROM python:3.12-slim AS base

# Install system-level packages needed by EasyOCR, Tesseract, and Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-hin \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only requirements first (for layer caching)
COPY server_requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r server_requirements.txt

# ── Stage 2: App ──────────────────────────────────────────────────────────────
# Copy all server-side Python source files
COPY server_main.py .
COPY server_ai.py .
COPY server_auth.py .
COPY server_cache.py .
COPY server_db.py .
COPY server_mentor.py .
COPY server_ocr.py .
COPY server_progress.py .
COPY ocr.py .
COPY services/ ./services/
COPY database/ ./database/

# Cloud Run injects PORT env variable; default to 8000 for local testing
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

# Expose the port
EXPOSE 8080

# Start FastAPI with uvicorn on Cloud Run's expected port (8080)
CMD exec uvicorn server_main:app --host 0.0.0.0 --port ${PORT:-8080} --workers 1
