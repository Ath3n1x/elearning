from pydantic import BaseModel, Field

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    age: int | None = None
    grade: str | None = None

class User(BaseModel):
    id: int
    name: str = Field(..., alias="username")
    email: str
    is_active: bool
    # Add age and grade if present in the model
    age: int | None = None
    grade: str | None = None

    class Config:
        from_attributes = True
        allow_population_by_field_name = True
