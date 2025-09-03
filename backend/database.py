from sqlalchemy import create_engine, Column, Integer, String, Float, Date, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from datetime import datetime
import os

# Database configuration
DATABASE_URL = "sqlite:///./anesthetist_tracker.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    services = relationship("Service", back_populates="doctor")

class Hospital(Base):
    __tablename__ = "hospitals"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    services = relationship("Service", back_populates="hospital")

class Service(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    patient_name = Column(String, nullable=False)
    patient_number = Column(String, nullable=False)
    service_date = Column(Date, nullable=False)
    days_of_service = Column(Integer, nullable=False)
    amount_charged = Column(Float, nullable=False)
    anesthesia_type = Column(String, nullable=False)
    medication_used = Column(Text)
    bill_filename = Column(String)  # Stores uploaded file name
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    doctor = relationship("User", back_populates="services")
    hospital = relationship("Hospital", back_populates="services")

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Initialize database with sample data
def init_db():
    from auth import get_password_hash
    
    db = SessionLocal()
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == "doctor@example.com").first()
    if not existing_user:
        # Create default user
        default_user = User(
            email="doctor@example.com",
            hashed_password=get_password_hash("password123"),
            full_name="Dr. John Smith"
        )
        db.add(default_user)
    
    # Add sample hospitals
    sample_hospitals = ["City General Hospital", "St. Mary's Medical Center", "Regional Health Center"]
    for hospital_name in sample_hospitals:
        existing_hospital = db.query(Hospital).filter(Hospital.name == hospital_name).first()
        if not existing_hospital:
            hospital = Hospital(name=hospital_name)
            db.add(hospital)
    
    db.commit()
    db.close()