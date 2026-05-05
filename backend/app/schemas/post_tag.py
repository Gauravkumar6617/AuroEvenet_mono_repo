from pydantic import BaseModel, ConfigDict


class PostTagCreate(BaseModel):
    """Used when a caller submits a tag by name string."""
    tag: str


class PostTagResponse(BaseModel):
    id: int
    tag_id: int
    tag_name: str
    tag_slug: str

    model_config = ConfigDict(from_attributes=True)
