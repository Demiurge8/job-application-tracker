# 🗂️ Job Application Tracker — Повний Roadmap

> Проект для портфоліо: React + TypeScript + TailwindCSS + PostgreSQL  
> Мета: показати роботодавцю реальний full-stack проект з чистим кодом і документацією

---

## 📋 Що це за проект

Веб-додаток для відстеження заявок на роботу. Користувач може:
- Додавати вакансії (компанія, посада, дата, статус)
- Оновлювати статус (Відправлено / Інтерв'ю / Відмова / Оффер)
- Фільтрувати і сортувати список
- Додавати нотатки до кожної заявки

**Чому саме цей проект:**
- Реальна проблема (не todo app)
- Покриває весь стек: UI → API → база даних
- Легко пояснити на інтерв'ю
- Можна показати живе demo

---

## 🗂️ Структура папок

```
job-tracker/
├── frontend/                  # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/        # UI компоненти
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobForm.tsx
│   │   │   ├── JobTable.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── FilterBar.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   └── JobDetail.tsx
│   │   ├── api/               # функції для fetch запитів
│   │   │   └── jobs.ts
│   │   ├── types/             # TypeScript типи
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                   # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   │   └── jobs.ts
│   │   ├── controllers/
│   │   │   └── jobsController.ts
│   │   ├── db/
│   │   │   ├── connection.ts
│   │   │   └── schema.sql      # SQL схема бази
│   │   └── index.ts
│   └── package.json
│
├── README.md                  # Головна документація
└── .env.example               # Приклад змінних середовища
```

---

## 📅 Plan по тижнях

### Тиждень 1 — Setup + Database
**Ціль:** проект запускається локально, база даних створена

- [ ] Створити GitHub репозиторій (назва: `job-application-tracker`)
- [ ] Ініціалізувати frontend: `npm create vite@latest frontend -- --template react-ts`
- [ ] Встановити TailwindCSS
- [ ] Ініціалізувати backend: `npm init`, встановити Express, pg, dotenv, cors
- [ ] Написати `schema.sql` (див. нижче)
- [ ] Підключити PostgreSQL локально
- [ ] Перший коміт: `init: project structure and database schema`

**SQL схема (`schema.sql`):**
```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  company VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'sent' 
    CHECK (status IN ('sent', 'interview', 'rejected', 'offer')),
  applied_date DATE NOT NULL,
  notes TEXT,
  job_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### Тиждень 2 — Backend API
**Ціль:** всі API endpoints працюють, перевірені через Postman/Thunder Client

Endpoints:
```
GET    /api/jobs          — список всіх заявок
GET    /api/jobs/:id      — одна заявка
POST   /api/jobs          — додати нову
PUT    /api/jobs/:id      — оновити статус/нотатки
DELETE /api/jobs/:id      — видалити
```

- [ ] Написати `connection.ts` (підключення до PostgreSQL)
- [ ] Написати `jobsController.ts` з усіма функціями
- [ ] Написати `routes/jobs.ts`
- [ ] Перевірити всі endpoints через Thunder Client
- [ ] Коміт: `feat: REST API for jobs CRUD operations`

**TypeScript тип (frontend `types/index.ts`):**
```typescript
export type JobStatus = 'sent' | 'interview' | 'rejected' | 'offer';

export interface Job {
  id: number;
  company: string;
  position: string;
  status: JobStatus;
  applied_date: string;
  notes?: string;
  job_url?: string;
  created_at: string;
}

export type CreateJobInput = Omit<Job, 'id' | 'created_at'>;
```

---

### Тиждень 3 — Frontend UI
**Ціль:** інтерфейс відображає дані з API

Компоненти:
- [ ] `StatusBadge.tsx` — кольоровий бейдж статусу
- [ ] `JobCard.tsx` — картка однієї заявки
- [ ] `JobTable.tsx` — таблиця всіх заявок
- [ ] `JobForm.tsx` — форма додавання нової заявки
- [ ] `FilterBar.tsx` — фільтр по статусу
- [ ] `Dashboard.tsx` — головна сторінка

- [ ] Підключити frontend до backend (fetch або axios)
- [ ] Коміт: `feat: dashboard with job list and status filter`

---

### Тиждень 4 — Polish + Deploy
**Ціль:** проект онлайн з живим demo

- [ ] Написати README.md (шаблон нижче)
- [ ] Додати `.env.example`
- [ ] Deploy frontend на **Vercel** (безкоштовно)
- [ ] Deploy backend на **Railway** або **Render** (безкоштовно)
- [ ] Deploy PostgreSQL на **Supabase** (безкоштовно)
- [ ] Додати посилання на demo в README
- [ ] Фінальний коміт: `docs: README and deployment`

---

### Тижні 5–6 — Буфер
Без тиску. Доробка, баги, дрібні покращення.

---

## 📝 Шаблон README.md

```markdown
# Job Application Tracker

A full-stack web application to track job applications during the job search process.

## 🔗 Live Demo
[View Demo](https://your-app.vercel.app)

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, TailwindCSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Deploy:** Vercel (frontend), Railway (backend), Supabase (database)

## ✨ Features
- Add and manage job applications
- Track status: Sent / Interview / Rejected / Offer
- Filter by status
- Add notes to each application

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL

### Installation
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/job-application-tracker

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install

# Set up environment variables
cp .env.example .env
# Fill in your database credentials

# Run database schema
psql -U postgres -d jobtracker -f backend/src/db/schema.sql

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev
```

## 📁 Project Structure
[посилання на папку в GitHub]

## 👤 Author
Oleksandr Kravchenko — [LinkedIn](your-link) | [GitHub](your-link)
```

---

## 📌 Правила комітів (Git Commit Convention)

Завжди пиши коміти в цьому форматі:

```
тип: короткий опис що зроблено
```

| Тип | Коли використовувати |
|-----|---------------------|
| `init:` | початковий setup |
| `feat:` | нова функція |
| `fix:` | виправлення багу |
| `style:` | зміни CSS/UI без логіки |
| `refactor:` | покращення коду без нових функцій |
| `docs:` | зміни в README або коментарях |
| `chore:` | налаштування, залежності |

**Приклади:**
```
init: project structure and database schema
feat: GET /api/jobs endpoint with PostgreSQL
feat: JobTable component with status filter
fix: date formatting in JobCard
docs: README with setup instructions
```

---

## ✅ Критерії "проект готовий"

- [ ] Код є на GitHub з регулярними комітами (не один великий)
- [ ] README з описом, tech stack і посиланням на demo
- [ ] Живе demo (Vercel + Railway/Render)
- [ ] Всі 4 статуси працюють
- [ ] Форма додавання працює
- [ ] Фільтр по статусу працює
- [ ] Немає console.error в браузері
- [ ] TypeScript без `any` типів

---

## 💡 Поради по процесу

**Коли застряг:**
- Не сиди більше 30 хв на одній проблемі — пиши в ChatGPT або Stack Overflow
- Розбий задачу на ще менші кроки

**Коли немає енергії:**
- Зроби тільки один коміт — навіть маленький. `docs: update README`
- Activity graph на GitHub — це теж сигнал роботодавцю

**Коли хочеш додати більше:**
- Спочатку зроби базову версію повністю. Потім додавай.
- Краще зроблено просто, ніж незакінчено складно.
