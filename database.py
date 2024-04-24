

# add your database code
# first boilerplate 
# then 2 classes
# 1. Snippet (name, shorthand, code, created_at, description)  

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime 


Base = declarative_base()


class Snippet(Base):
    __tablename__ = "snippets"
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    shorthand = Column(String(50))
    code = Column(String)
    created_at = Column(DateTime, default=datetime.now)
    description = Column(String)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    email = Column(String(100), unique=True)
    password = Column(String(65))
    created_at = Column(DateTime, default=datetime.now)


def get_db():
    engine = create_engine("sqlite:///example.db")
    return sessionmaker(bind=engine)()

def add_to_db(obj):
    db = get_db()
    db.add(obj)
    db.commit()
    db.close()


if __name__ == "__main__":
    # Code to be executed when the script is run directly
    engine = create_engine("sqlite:///example.db")
    Base.metadata.create_all(engine)

    # Code to interact with the database, add data, etc.
