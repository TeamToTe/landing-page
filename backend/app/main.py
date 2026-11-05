import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func

from .database import engine, Base, get_db
from .models import Post, Game
from .seed_data import seed_initial_data
from .routers import posts, games

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create DB tables
    Base.metadata.create_all(bind=engine)
    # Seed initial data
    db = next(get_db())
    try:
        seed_initial_data(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Team Tố Tề Blog & Games API",
    description="Backend API cho Team Tố Tề Landing Page, Blog và Game Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploads directory if needed
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
uploads_dir = os.path.join(BASE_DIR, "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include routers
app.include_router(posts.router)
app.include_router(games.router)

@app.get("/")
def root():
    return {
        "app": "Team Tố Tề Blog & Game API",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    posts_count = db.query(Post).filter(Post.published == True).count()
    games_count = db.query(Game).count()
    total_views = db.query(func.sum(Post.views)).scalar() or 0
    total_plays = db.query(func.sum(Game.plays_count)).scalar() or 0

    return {
        "posts_count": posts_count,
        "games_count": games_count,
        "total_views": total_views,
        "total_plays": total_plays
    }
