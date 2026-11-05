import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from ..database import get_db
from ..models import Game
from ..schemas import GameCreate, GameResponse

router = APIRouter(prefix="/api/games", tags=["Games"])

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'[^a-z0-9-]', '', text)
    return text.strip('-')

@router.get("", response_model=List[GameResponse])
def get_games(
    q: Optional[str] = Query(None, description="Search keyword in title or description"),
    category: Optional[str] = Query(None, description="Filter by category"),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(Game)

    if category and category.lower() != "all":
        query = query.filter(func.lower(Game.category) == category.lower())

    if q:
        query = query.filter(
            or_(
                Game.title.ilike(f"%{q}%"),
                Game.description.ilike(f"%{q}%")
            )
        )

    games = query.order_by(Game.created_at.desc()).offset(skip).limit(limit).all()
    return games

@router.get("/{identifier}", response_model=GameResponse)
def get_game(identifier: str, db: Session = Depends(get_db)):
    game = None
    if identifier.isdigit():
        game = db.query(Game).filter(Game.id == int(identifier)).first()
    if not game:
        game = db.query(Game).filter(Game.slug == identifier).first()

    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game không tồn tại")

    return game

@router.post("/{identifier}/play")
def record_game_play(identifier: str, db: Session = Depends(get_db)):
    game = None
    if identifier.isdigit():
        game = db.query(Game).filter(Game.id == int(identifier)).first()
    if not game:
        game = db.query(Game).filter(Game.slug == identifier).first()

    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game không tồn tại")

    game.plays_count += 1
    db.commit()
    return {"message": "Play counted", "plays_count": game.plays_count}

@router.post("", response_model=GameResponse, status_code=status.HTTP_201_CREATED)
def create_game(game_data: GameCreate, db: Session = Depends(get_db)):
    slug_base = game_data.slug or slugify(game_data.title)
    if not slug_base:
        slug_base = "game"

    unique_slug = slug_base
    counter = 1
    while db.query(Game).filter(Game.slug == unique_slug).first():
        unique_slug = f"{slug_base}-{counter}"
        counter += 1

    game_dict = game_data.model_dump()
    game_dict["slug"] = unique_slug

    new_game = Game(**game_dict)
    db.add(new_game)
    db.commit()
    db.refresh(new_game)
    return new_game
