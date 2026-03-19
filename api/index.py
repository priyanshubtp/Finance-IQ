from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, Expense, engine, Base
from predictor import predict_zero_balance_date
from pydantic import BaseModel
from datetime import date, timedelta
from typing import List
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ExpenseCreate(BaseModel):
    amount: float
    category: str
    date: date
    description: str

class ExpenseResponse(ExpenseCreate):
    id: int

@app.get("/api")
@app.get("/")
def read_root():
    return {"message": "Welcome to the Finance Dashboard API"}

@app.post("/api/expenses/", response_model=ExpenseResponse)
@app.post("/expenses/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.get("/api/expenses/", response_model=List[ExpenseResponse])
@app.get("/expenses/", response_model=List[ExpenseResponse])
def get_expenses(db: Session = Depends(get_db)):
    return db.query(Expense).all()

@app.delete("/api/expenses/{expense_id}")
@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(db_expense)
    db.commit()
    return {"message": "Expense deleted successfully"}

@app.get("/api/predict/")
@app.get("/predict/")
def get_prediction(budget: float, db: Session = Depends(get_db)):
    expenses = db.query(Expense).all()
    expense_data = [{"amount": e.amount, "date": e.date} for e in expenses]
    
    predicted_zero_date, r2_score = predict_zero_balance_date(expense_data, budget)

    days_until_zero = None
    if predicted_zero_date:
        from datetime import datetime
        delta = datetime.strptime(predicted_zero_date, '%Y-%m-%d').date() - date.today()
        days_until_zero = max(0, delta.days)
    
    return {
        "budget": budget,
        "predicted_zero_date": predicted_zero_date,
        "days_until_zero": days_until_zero,
        "r2_score": r2_score
    }

@app.post("/api/seed-demo/")
@app.post("/seed-demo/")
def seed_demo(db: Session = Depends(get_db)):
    # Clear existing data
    db.query(Expense).delete()
    
    descriptions = {
      "Food": [
        "Grocery run — Walmart", "Coffee & breakfast",
        "Restaurant dinner", "Takeaway delivery",
        "Supermarket weekly shop", "Bakery & snacks"
      ],
      "Transport": [
        "Uber ride to office", "Metro monthly pass",
        "Petrol station fill-up", "Airport cab",
        "Parking fee downtown", "Bus pass top-up"
      ],
      "Rent": [
        "Monthly rent payment", "Electricity bill",
        "Internet & cable", "Water utility",
        "Building maintenance fee", "Home insurance"
      ],
      "Entertainment": [
        "Netflix subscription", "Spotify Premium",
        "Movie tickets × 2", "Gaming top-up",
        "Concert tickets", "Amazon Prime"
      ],
      "Other": [
        "Gym membership", "Phone bill",
        "Medical checkup", "Amazon order",
        "Stationery & supplies", "Haircut"
      ]
    }
    
    categories = list(descriptions.keys())
    base_date = date.today() - timedelta(days=30)
    
    # Track indices for rotation
    rotation_indices = {cat: 0 for cat in categories}

    # Add fixed rent
    db_expense = Expense(
        amount=1200.0,
        category="Rent",
        date=base_date + timedelta(days=1),
        description="Monthly Rent Payment"
    )
    db.add(db_expense)
    
    # Generate random expenses
    for i in range(30):
        current_date = base_date + timedelta(days=i)
        num_expenses = random.randint(1, 4)
        for _ in range(num_expenses):
            cat = random.choice(categories)
            desc_list = descriptions[cat]
            desc = desc_list[rotation_indices[cat] % len(desc_list)]
            rotation_indices[cat] += 1
            
            db_expense = Expense(
                amount=round(random.uniform(10.0, 150.0), 2),
                category=cat,
                date=current_date,
                description=desc
            )
            db.add(db_expense)
            
    db.commit()
    return {"message": "Demo data seeded successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
