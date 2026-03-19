import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

def predict_zero_balance_date(expenses, current_budget):
    if not expenses or len(expenses) < 2:
        return None

    # Sort expenses by date
    df = pd.DataFrame(expenses)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')

    # Group by day and sum expenses
    daily_expenses = df.groupby('date')['amount'].sum().reset_index()
    
    # Calculate cumulative spending
    daily_expenses['cumulative_spending'] = daily_expenses['amount'].cumsum()
    
    # Prepare features for Linear Regression (days since first expense)
    first_date = daily_expenses['date'].min()
    daily_expenses['days_since_start'] = (daily_expenses['date'] - first_date).dt.days
    
    X = daily_expenses[['days_since_start']]
    y = daily_expenses['cumulative_spending']
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict when cumulative_spending reaches current_budget
    # y = mx + c  => x = (y - c) / m
    m = model.coef_[0]
    c = model.intercept_
    score = float(model.score(X, y))
    
    if m <= 0: # Spending is not increasing
        return None, 0.0
        
    days_to_zero = (current_budget - c) / m
    prediction_date = first_date + timedelta(days=int(days_to_zero))
    
    return prediction_date.strftime('%Y-%m-%d'), score
