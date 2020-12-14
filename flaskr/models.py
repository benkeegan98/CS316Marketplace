#from database import Base, Column, Model, Integer, String, 


from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    __table_args__ = {'schema': 'marketplace'}
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(256), nullable=False)
    email = Column(String(256), nullable=False)
    password = Column(String(64), nullable=False)
    major =Column(String(64))
    class_year = Column(Integer, nullable=False)
    profile_pic = Column(String(256))
    security_question_answer = Column(String(256))

    def __init__(self, name=None, email=None, password=None):
        self.name = name
        self.email = email
        self.password = password
    
    def __repr__(self):
        return '<User %r' % self.email

class Message(Base):
    __tablename__ = 'message'
    __table_args__ = {'schema': 'marketplace'}
    msg_id = Column(Integer, primary_key=True, nullable=False)
    sender_id = Column(Integer, ForeignKey('marketplace.user.id'), nullable=False)
    receiver_id = Column(Integer, ForeignKey('marketplace.user.id'), nullable=False)
    content = Column(String(160))
    sent_datetime = Column(DateTime)
    read_datetime = Column(DateTime)
    #Relationships
    user = relationship('User', backref=backref('message'))

class Buyer(Base):
    __tablename__ = 'buyer'
    __table_args__ = {'schema': 'marketplace'}
    user_id = Column(Integer, primary_key=True, ForeignKey('marketplace.user.id'), nullable=False)
    buyer_zip = Column(Integer, nullable=False)
    #Relationships
    user = relationship('User', backref=backref('buyer'))

class Seller(Base):
    __tablename__ = 'seller'
    __table_args__ = {'schema': 'marketplace'}
    user_id = Column(Integer, primary_key=True, ForeignKey('marketplace.user.id'), nullable=False)
    seller_rating = Column(Integer, nullable=False)
    #Relationships
    user = relationship('User', backref=backref('seller'))

class Sells(Base):
    __tablename__ = 'sells'
    __table_args__ = {'schema': 'marketplace'}
    user_id = Column(Integer, primary_key=True, ForeignKey('marketplace.user.id'), nullable=False)
    listing_id = Column(Integer, ForeignKey('marketplace.listing.id'), nullable=False)
    #Relationships
    user = relationship('User', backref=backref('sells'))
    listing = relationship('Listing', backref=backref('sells'))

class Review(Base):
    __tablename__ = 'review'
    __table_args__ = {'schema': 'marketplace'}
    buyer_id = Column(Integer, primary_key=True, ForeignKey('marketplace.buyer.user_id'), nullable=False)
    seller_id = Column(Integer, ForeignKey('marketplace.seller.user_id'), nullable=False)
    score = Column(Integer, nullable=False)
    #Relationships
    buyer = relationship('Buyer', backref=backref('review'))
    seller = relationship('Seller', backref=backref('review'))

reviews_table = Table('reviews', Base.metadata,
    Column('buyer_id', Integer, ForeignKey('marketplace.buyer.id')),
    Column('seller_id', Integer, ForeignKey('marketplace.seller.id'))
)

class inFavorites(Base):
    __tablename__ = 'favorites'
    __table_args__ = {'schema': 'marketplace'}
    user_id = Column(Integer, primary_key=True, ForeignKey('marketplace.user.id'), nullable=False)
    listing_id = Column(Integer, primary_key=True, ForeignKey('marketplace.listing.id'), nullable=False)
    price = Column(Integer, nullable=False)
    #Relationships
    user = relationship('User', backref=backref('favorites'))
    listing = relationship('Listing', backref=backref('favorites'))

favorites_table = Table('infavorites', Base.metadata,
    Column('user_id', Integer, ForeignKey('marketplace.user.id')),
    Column('listing_id', Integer, ForeignKey('marketplace.listing.id'))
)

class Purchase(Base):
    __tablename__ = 'purchase'
    __table_args__ = {'schema': 'marketplace'}
    id = Column(Integer, primary_key=True, nullable=False)
    buyer_id = Column(Integer, ForeignKey('marketplace.buyer.user_id'), nullable=False)
    listing_id = Column(Integer, ForeignKey('marketplace.listing.id'), nullable=False)
    total = Column(Integer, nullable=False)
    date_time = Column(DateTime, default = func.now(), nullable=False)
    retrieval_method = Column(String(26), nullable=False)
    #Relationships
    buyer = relationship('Buyer', backref=backref('purchase'))
    listing = relationship('Listing', backref=backref('purchase'))

class Listing(Base):
    __tablename__ = 'listing'
    __table_args__ = {'schema': 'marketplace'}
    id = Column(Integer, primary_key=True, nullable=False)
    seller_id = Column(Integer, ForeignKey('marketplace.seller.user_id'), nullable=False)
    name = Column(String(256), nullable=False)
    price = Column(Integer, nullable=False)
    description = Column(String(256), nullable=False)
    sold = Column(Boolean, nullable=False)
    ship = Column(Boolean, nullable=False)
    pick_up = Column(Boolean, nullable=False)
    category = Column(String)
    weight= Column(Integer, nullable=False)
    zipcode = Column(Integer, nullable=False)
    #Relationships
    seller = relationship('Seller', backref=backref('listing'))
    keywords = relationship('keyword', lazy='select', backref=backref('listing'), nullable=False)
    images = relationship('image', lazy='select', backref=backref('listing'), nullable=False)

class Image(Base):
    __tablename__ = 'image'
    __table_args__ = {'schema': 'marketplace'}
    listing_id = Column(Integer, ForeignKey('marketplace.listing.id'))
    image_path = Column(String(56))
    #Relationships
    listing = relationship('Listing', backref=backref('image'))

class Keyword(Base):
    __tablename__ = 'keyword'
    __table_args__ = {'schema': 'marketplace'}
    listing_id = Column(Integer, ForeignKey('marketplace.listing.id'))
    word = Column(String(56))
    #Relationships
    listing = relationship('Listing', backref=backref('keyword'))

keywords_table = Table('keywords', Base.metadata,
    Column('listing_id', Integer, ForeignKey('marketplace.listing.id'))
)
    
    
