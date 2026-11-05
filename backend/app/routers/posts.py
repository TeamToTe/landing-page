import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from ..database import get_db
from ..models import Post
from ..schemas import PostCreate, PostResponse

router = APIRouter(prefix="/api/posts", tags=["Posts"])

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'[^a-z0-9-]', '', text)
    return text.strip('-')

@router.get("", response_model=List[PostResponse])
def get_posts(
    q: Optional[str] = Query(None, description="Search keyword in title, excerpt or content"),
    category: Optional[str] = Query(None, description="Filter by category"),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(Post).filter(Post.published == True)

    if category and category.lower() != "all":
        query = query.filter(func.lower(Post.category) == category.lower())

    if q:
        search_filter = or_(
            Post.title.ilike(f"%{q}%"),
            Post.excerpt.ilike(f"%{q}%"),
            Post.content.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)

    posts = query.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    return posts

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    results = db.query(Post.category, func.count(Post.id)).filter(Post.published == True).group_by(Post.category).all()
    return [{"name": r[0], "count": r[1]} for r in results]

@router.get("/{identifier}", response_model=PostResponse)
def get_post(identifier: str, db: Session = Depends(get_db)):
    # Try by id if numeric, otherwise by slug
    post = None
    if identifier.isdigit():
        post = db.query(Post).filter(Post.id == int(identifier)).first()
    if not post:
        post = db.query(Post).filter(Post.slug == identifier).first()

    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bài viết không tồn tại")

    # Increment view counter
    post.views += 1
    db.commit()
    db.refresh(post)

    return post

@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(post_data: PostCreate, db: Session = Depends(get_db)):
    # Generate slug if empty
    slug_base = post_data.slug or slugify(post_data.title)
    if not slug_base:
        slug_base = "post"

    unique_slug = slug_base
    counter = 1
    while db.query(Post).filter(Post.slug == unique_slug).first():
        unique_slug = f"{slug_base}-{counter}"
        counter += 1

    post_dict = post_data.model_dump()
    post_dict["slug"] = unique_slug

    new_post = Post(**post_dict)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post
