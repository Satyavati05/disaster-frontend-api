from backend.app import app

# Vercel serverless functions require the handler to be the app instance itself
# or a specific function. By exporting 'app', Vercel's Python runtime will find it.
