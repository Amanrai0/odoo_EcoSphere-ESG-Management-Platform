# EcoSphere Governance Module

React + Django implementation of Kunal's policies, audits, compliance issues, notifications, and governance score module.

## Start the API

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Start the dashboard

```powershell
cd frontend
npm install
npm run dev
```

If your terminal is already inside `frontend`, do not run `cd frontend` again. If Vite reports a missing `rollup-binding-win32-x64-msvc.node`, remove the incomplete install and reinstall its optional Windows packages:

```powershell
Remove-Item -Recurse -Force node_modules
npm install --include=optional
npm run dev
```

Open the Vite address shown in the terminal (normally `http://127.0.0.1:5173`). The Django root at `http://127.0.0.1:8000` redirects there. The React app uses `http://localhost:8000/api/v1`. Create a Django superuser with `python manage.py createsuperuser`, then use the Django admin to add departments, policies, audits, and issues.

## Governance rule

`score = max(0, min(100, 100 - (open issues × 10) - (overdue issues × 25)))`
