---
marp: true
theme: default
paginate: true
_class: lead
---

# 🐘 Introduction to PostgreSQL

### for LBAW Students

---

## 🧭 Agenda

1. What is PostgreSQL
2. How it differs from SQLite
3. Why LBAW uses PostgreSQL
4. Installing via Docker
5. Exploring the psql CLI
6. Understanding `create.sql` and `populate.sql`
7. Common SQL features and syntax
8. Hands-on walkthrough
9. Useful tools (DataGrip, pgAdmin, etc.)
10. Next steps

---

## 💭 Quick Recap: SQLite

- Embedded database - **just a file**
- Good for small projects or local apps
- No user accounts or concurrent clients
- Very simple setup: `sqlite3 database.db`
- Ideal for prototyping, but limited scalability

---

## 🆚 PostgreSQL vs SQLite

| Feature        | SQLite      | PostgreSQL               |
| -------------- | ----------- | ------------------------ |
| Type           | File-based  | Server-based             |
| Concurrency    | 1 writer    | Many concurrent users    |
| Data Types     | Dynamic     | Strongly typed           |
| Features       | Minimal     | Full SQL, JSON, triggers |
| Scalability    | Small/local | Large systems            |
| Authentication | None        | User/role-based          |

---

## 💡 Why PostgreSQL?

- Open-source, production-grade database
- Strict **data integrity** (constraints, foreign keys, etc.)
- Rich **data types** (JSONB, arrays, enums)
- Transactional and concurrent
- Compatible with **Laravel** and **Docker**

---

## 🧰 LBAW Setup Overview

Your LBAW environment will include:

- **Web application** (Laravel + PHP)
- **PostgreSQL database** (Docker container)
- Two key SQL files:
  - `create.sql` → database schema
  - `populate.sql` → sample/test data

---

## ⚙️ Installing PostgreSQL via Docker

### 1️⃣ Pull the image

```bash
docker pull postgres
```

### 2️⃣ Run the container

```bash
docker run --name lbaw-postgres \
  -e POSTGRES_USER=lbaw \
  -e POSTGRES_PASSWORD=lbawpass \
  -e POSTGRES_DB=lbaw \
  -p 5432:5432 \
  -d postgres
```

---

## 🧩 Connecting to PostgreSQL

Enter the container and connect:

```bash
docker exec -it lbaw-postgres psql -U lbaw -d lbaw
```

Or use a GUI client (like DBeaver or pgAdmin).

---

## 🧩 Basic Commands

Inside `psql`:

```sql
\l             -- List databases
\c lbaw        -- Connect to a database
\dt            -- List tables
\d table_name  -- Describe a table
\q             -- Quit
```

---

## 🧱 The `create.sql` File

Defines your **database schema**.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🌱 The `populate.sql` File

Adds **initial data** for testing.

```sql
INSERT INTO users (name, email)
VALUES
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com'),
  ('Charlie', 'charlie@example.com');
```

---

## 🧩 Running the Scripts

Run directly from your host:

```bash
docker exec -i lbaw-postgres \
  psql -U lbaw -d lbaw < database/create.sql

docker exec -i lbaw-postgres \
  psql -U lbaw -d lbaw < database/populate.sql
```

Or from `psql`:

```sql
\i database/create.sql
\i database/populate.sql
```

---

## 🧠 Understanding the Schema

Think of `create.sql` as a **blueprint**:

- Defines **tables**
- Declares **relationships** (foreign keys)
- Enforces **rules** (constraints)
- Provides **indexes** for efficiency

---

## 🔒 Data Integrity Example

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

➡ Ensures every post belongs to an existing user.

---

## 🧮 PostgreSQL Data Types

Some common types:

| Category | Examples                       |
| -------- | ------------------------------ |
| Numeric  | `INTEGER`, `BIGINT`, `NUMERIC` |
| Text     | `CHAR`, `VARCHAR`, `TEXT`      |
| Temporal | `DATE`, `TIME`, `TIMESTAMP`    |
| Boolean  | `BOOLEAN`                      |
| Advanced | `JSONB`, `ARRAY`, `ENUM`       |

---

## 🧪 Hands-on Exercise

1. Create a new table called `project`:
   ```sql
   CREATE TABLE project (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT
   );
   ```
2. Insert a few rows
3. Query them:
   ```sql
   SELECT * FROM project;
   ```

---

## 🧰 Useful Tools

- **psql** → built-in CLI (always available)
- **pgAdmin** → web GUI
- **DBeaver** → cross-platform desktop app
- **Adminer** → lightweight web client (can run via Docker)
- **DataGrip** → advanced IDE for SQL (see next slide 👇)

---

## 💻 DataGrip (Recommended)

- Professional SQL IDE by **JetBrains**
- Features:
  - Smart autocomplete and code formatting
  - Visual table browsing
  - Easy Docker / remote DB connections
  - Built-in data editing tools

💡 **Students get it for free!**  
Go to 👉 [https://www.jetbrains.com/academy/student-pack/](https://www.jetbrains.com/academy/student-pack/)

Use your **FEUP email** (or GitHub Student Pack) to unlock DataGrip (and other JetBrains IDEs like IntelliJ, PyCharm, etc.).

---

## ⚙️ Docker Tips

```bash
# Check running containers
docker ps

# Stop/start database
docker stop lbaw-postgres
docker start lbaw-postgres

# Remove container
docker rm -f lbaw-postgres
```

---

## 🧭 Summary

✅ PostgreSQL = **robust**, **multi-user**, **production-ready** DB  
✅ SQLite → great for local prototyping  
✅ In LBAW, use:

- `create.sql` → define schema
- `populate.sql` → seed data  
  ✅ Run everything with **Docker + psql**  
  ✅ Optional: use **DataGrip** for a better development experience

---

## 🚀 Next Session Preview

Next time we’ll explore:

- Constraints and foreign keys
- Views and indexes
- Triggers and stored procedures

---

## 💬 Questions?
