from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class PostBase(BaseModel):
    title: str = Field(..., example="Exploring Small Language Models")
    excerpt: str = Field(..., example="A deep dive into lightweight models running on consumer hardware.")
    content: str = Field(..., example="## Introduction\nSmall Language Models (SLMs) are revolutionizing AI on edge devices...")
    category: str = Field(..., example="AI")
    cover_image: Optional[str] = None
    author: Optional[str] = "Team Tố Tề"
    published: Optional[bool] = True

class PostCreate(PostBase):
    slug: Optional[str] = None

class PostResponse(PostBase):
    id: int
    slug: str
    created_at: datetime
    views: int

    class Config:
        from_attributes = True

class GameBase(BaseModel):
    title: str = Field(..., example="Neon Runner 2D")
    description: str = Field(..., example="An endless 2D platform runner built with modern web canvas.")
    details: Optional[str] = "Dodge obstacles, jump over pits, and beat your high score!"
    category: str = Field("Arcade", example="Arcade")
    cover_image: Optional[str] = None
    play_url: Optional[str] = None
    game_type: Optional[str] = "embedded"
    developer: Optional[str] = "Team Tố Tề Devs"

class GameCreate(GameBase):
    slug: Optional[str] = None

class GameResponse(GameBase):
    id: int
    slug: str
    created_at: datetime
    plays_count: int

    class Config:
        from_attributes = True
