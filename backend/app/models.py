from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from .database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(200), unique=True, index=True)
    title = Column(String(255), nullable=False)
    excerpt = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(50), nullable=False, default="General")  # AI, Game, Research, etc.
    cover_image = Column(String(500), nullable=True)
    author = Column(String(100), default="Team Tố Tề")
    created_at = Column(DateTime, default=datetime.utcnow)
    views = Column(Integer, default=0)
    published = Column(Boolean, default=True)

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(200), unique=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(500), nullable=False)
    details = Column(Text, nullable=True)
    category = Column(String(50), default="Arcade")
    cover_image = Column(String(500), nullable=True)
    play_url = Column(String(500), nullable=True)  # External link or embedded game identifier
    game_type = Column(String(50), default="embedded")  # "embedded", "external", "download"
    developer = Column(String(100), default="Team Tố Tề Devs")
    created_at = Column(DateTime, default=datetime.utcnow)
    plays_count = Column(Integer, default=0)
