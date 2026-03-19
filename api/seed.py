from database import SessionLocal, Expense, engine, Base
from datetime import date, timedelta
import random

def seed_data():
    db = SessionLocal()
    # Clear existing data
    db.query(Expense).delete()
    
    categories = ["Food", "Transport", "Rent", "Entertainment", "Utilities"]
    start_date = date.today() - timedelta(days=30)
    
    for i in range(30):
        current_date = start_date + timedelta(days=i)
        # Add 1-3 expenses per day
        for _ in range(random.randint(1, 3)):
            expense = Expense(
                amount=random.uniform(10, 100),
                category=random.choice(categories),
                date=current_date,
                description=f"Mock expense for {current_date}"
            )
            db.add(expense)
    
    db.commit()
    db.close()
    print("Database seeded with mock data.")

if __name__ == "__main__":
    seed_data()
