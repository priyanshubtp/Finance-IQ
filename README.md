# FinanceIQ - Premium Personal Finance Dashboard

Built with a modern stack for high-performance financial tracking and AI-driven predictions.

## 🚀 Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui (Nova)
- **Animations**: Framer Motion (Staggered loads, Number counters)
- **Data Fetching**: SWR (Stale-While-Revalidate)
- **Charts**: Recharts (Dynamic imports, Custom tooltips)
- **Backend**: FastAPI (Python), Scikit-Learn (Linear Regression), SQLAlchemy
- **Database**: SQLite

## ✨ Core Features
- **AI "Zero-Day" Prediction**: Projects exactly when your budget will hit $0 based on daily spending habits.
- **Premium Dark-First UI**: Custom Indigo/Slate palette with glassmorphism and Geist typography.
- **Interactive Analytics**: Monthly spending vs budget comparisons and category-level allocation.
- **Responsive Navigation**: Mobile-first design with a collapsible sidebar and clean desktop transition.

## 🛠️ Local Setup

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install --legacy-peer-deps`
3. `npm run dev`

Launch [localhost:3000](http://localhost:3000) to view the dashboard.
