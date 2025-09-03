from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, date
from typing import Optional, List
import pandas as pd
import os
import shutil
from pydantic import BaseModel

from database import get_db, create_tables, init_db, User, Hospital, Service
from auth import verify_password, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

# Create FastAPI app
app = FastAPI(title="Anesthetist Service Tracker", version="1.0.0")

# CORS middleware - Allow Vercel frontend and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
        "https://patient-tracker.vercel.app",  # Replace with your actual Vercel URL
        "https://*.vscode.dev"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs("uploads", exist_ok=True)

# Pydantic models
class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str

class HospitalCreate(BaseModel):
    name: str

class HospitalResponse(BaseModel):
    id: int
    name: str

class ServiceCreate(BaseModel):
    hospital_id: int
    patient_name: str
    patient_number: str
    service_date: date
    days_of_service: int
    amount_charged: float
    anesthesia_type: str
    medication_used: Optional[str] = None

class ServiceResponse(BaseModel):
    id: int
    hospital_name: str
    patient_name: str
    patient_number: str
    service_date: date
    days_of_service: int
    amount_charged: float
    anesthesia_type: str
    medication_used: Optional[str]
    bill_filename: Optional[str]
    created_at: datetime

class DashboardStats(BaseModel):
    total_patients: int
    total_revenue: float
    total_services: int
    total_hospitals: int

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    create_tables()
    init_db()

# Authentication endpoints
@app.post("/api/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Hospital endpoints
@app.get("/api/hospitals", response_model=List[HospitalResponse])
async def get_hospitals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    hospitals = db.query(Hospital).all()
    return hospitals

@app.post("/api/hospitals", response_model=HospitalResponse)
async def create_hospital(
    hospital: HospitalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if hospital already exists
    existing_hospital = db.query(Hospital).filter(Hospital.name == hospital.name).first()
    if existing_hospital:
        raise HTTPException(status_code=400, detail="Hospital already exists")
    
    db_hospital = Hospital(name=hospital.name)
    db.add(db_hospital)
    db.commit()
    db.refresh(db_hospital)
    return db_hospital

# Service endpoints
@app.post("/api/services")
async def create_service(
    hospital_id: int = Form(...),
    patient_name: str = Form(...),
    patient_number: str = Form(...),
    service_date: date = Form(...),
    days_of_service: int = Form(...),
    amount_charged: float = Form(...),
    anesthesia_type: str = Form(...),
    medication_used: Optional[str] = Form(None),
    bill_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Handle file upload
    bill_filename = None
    if bill_file and bill_file.filename:
        # Create unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        bill_filename = f"{timestamp}_{bill_file.filename}"
        file_path = f"uploads/{bill_filename}"
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(bill_file.file, buffer)
    
    # Create service record
    db_service = Service(
        doctor_id=current_user.id,
        hospital_id=hospital_id,
        patient_name=patient_name,
        patient_number=patient_number,
        service_date=service_date,
        days_of_service=days_of_service,
        amount_charged=amount_charged,
        anesthesia_type=anesthesia_type,
        medication_used=medication_used,
        bill_filename=bill_filename
    )
    
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    
    return {"message": "Service created successfully", "id": db_service.id}

@app.get("/api/services", response_model=List[ServiceResponse])
async def get_services(
    hospital_id: Optional[int] = Query(None),
    anesthesia_type: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Service).filter(Service.doctor_id == current_user.id)
    
    # Apply filters
    if hospital_id:
        query = query.filter(Service.hospital_id == hospital_id)
    if anesthesia_type:
        query = query.filter(Service.anesthesia_type.ilike(f"%{anesthesia_type}%"))
    if start_date:
        query = query.filter(Service.service_date >= start_date)
    if end_date:
        query = query.filter(Service.service_date <= end_date)
    
    services = query.all()
    
    # Format response with hospital names
    result = []
    for service in services:
        hospital = db.query(Hospital).filter(Hospital.id == service.hospital_id).first()
        result.append(ServiceResponse(
            id=service.id,
            hospital_name=hospital.name if hospital else "Unknown",
            patient_name=service.patient_name,
            patient_number=service.patient_number,
            service_date=service.service_date,
            days_of_service=service.days_of_service,
            amount_charged=service.amount_charged,
            anesthesia_type=service.anesthesia_type,
            medication_used=service.medication_used,
            bill_filename=service.bill_filename,
            created_at=service.created_at
        ))
    
    return result

# Dashboard stats
@app.get("/api/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    services = db.query(Service).filter(Service.doctor_id == current_user.id).all()
    
    total_patients = len(set(service.patient_number for service in services))
    total_revenue = sum(service.amount_charged for service in services)
    total_services = len(services)
    total_hospitals = len(set(service.hospital_id for service in services))
    
    return DashboardStats(
        total_patients=total_patients,
        total_revenue=total_revenue,
        total_services=total_services,
        total_hospitals=total_hospitals
    )

# Excel export
@app.get("/api/export/excel")
async def export_to_excel(
    hospital_id: Optional[int] = Query(None),
    anesthesia_type: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get filtered services
    query = db.query(Service).filter(Service.doctor_id == current_user.id)
    
    if hospital_id:
        query = query.filter(Service.hospital_id == hospital_id)
    if anesthesia_type:
        query = query.filter(Service.anesthesia_type.ilike(f"%{anesthesia_type}%"))
    if start_date:
        query = query.filter(Service.service_date >= start_date)
    if end_date:
        query = query.filter(Service.service_date <= end_date)
    
    services = query.all()
    
    # Prepare data for Excel
    data = []
    for service in services:
        hospital = db.query(Hospital).filter(Hospital.id == service.hospital_id).first()
        data.append({
            'Hospital': hospital.name if hospital else 'Unknown',
            'Patient Name': service.patient_name,
            'Patient Number': service.patient_number,
            'Service Date': service.service_date.strftime('%Y-%m-%d'),
            'Days of Service': service.days_of_service,
            'Amount Charged': service.amount_charged,
            'Anesthesia Type': service.anesthesia_type,
            'Medication Used': service.medication_used or '',
            'Created At': service.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    
    # Create Excel file
    df = pd.DataFrame(data)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"anesthetist_services_{timestamp}.xlsx"
    filepath = f"uploads/{filename}"
    
    df.to_excel(filepath, index=False, engine='openpyxl')
    
    return FileResponse(
        path=filepath,
        filename=filename,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

# File download
@app.get("/api/files/{filename}")
async def download_file(
    filename: str,
    current_user: User = Depends(get_current_user)
):
    file_path = f"uploads/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(path=file_path, filename=filename)

if __name__ == "__main__":
    import uvicorn
    # Get port from environment variable (Render uses PORT env var)
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)