---
marp: true
title: "Advanced PostgreSQL for LBAW"
theme: default
paginate: true
---

# 🧠 Advanced PostgreSQL for LBAW

### Triggers, Views, Indexes & More

---

## 🔁 Quick Recap

- We learned how PostgreSQL differs from SQLite
- Installed Postgres via Docker
- Practiced basic SQL commands
- Built `create.sql` and `populate.sql` files

---

## 🧩 Constraints - Beyond Primary Keys

Constraints define **rules** for your data integrity.

Common types:

- `PRIMARY KEY` - unique identifier for rows
- `FOREIGN KEY` - maintains relationships between tables
- `UNIQUE` - prevents duplicate values
- `CHECK` - validates conditions
- `NOT NULL` - ensures a value is always provided

---

## 🔗 Example: Foreign Keys

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL
);
```

Same as:

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

💡 Use `ON DELETE` and `ON UPDATE` to define behavior.

---

## ⚙️ ON DELETE / ON UPDATE Actions

```sql
FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE
  ON UPDATE SET NULL;
```

Options:

- `CASCADE` → delete/update dependent rows
- `SET NULL` → replace with `NULL`
- `RESTRICT` → block deletion
- `NO ACTION` → default (error if referenced)

---

## 👁️ Views

Views are **virtual tables** - saved SQL queries.

```sql
CREATE VIEW user_posts AS
SELECT u.name, p.content
FROM users u
JOIN posts p ON p.user_id = u.id;
```

Use them to:

- Simplify complex queries
- Abstract data from multiple tables
- Control access to specific columns

---

## 🧱 Materialized Views

Similar to normal views, but **data is stored physically**.

```sql
CREATE MATERIALIZED VIEW top_posts AS
SELECT * FROM posts ORDER BY likes DESC;
```

- Faster for repeated reads
- Must be refreshed manually:

```sql
REFRESH MATERIALIZED VIEW top_posts;
```

---

## ⚡ Indexes

Indexes speed up lookups and joins.

```sql
CREATE INDEX idx_user_id ON posts(user_id);
```

Good for:

- `WHERE` clauses
- `JOIN` keys
- Large datasets

💡 But - avoid over-indexing! It slows down inserts/updates.

---

## 🧮 EXPLAIN - Query Analysis

Use `EXPLAIN` to see how PostgreSQL executes a query:

```sql
EXPLAIN SELECT * FROM posts WHERE user_id = 5;
```

Add `ANALYZE` for actual execution stats:

```sql
EXPLAIN ANALYZE SELECT * FROM posts WHERE user_id = 5;
```

---

## 🪄 Triggers

Triggers automatically run actions `before` or `after` an event.

```sql
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_time
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

---

## 🧠 Stored Procedures & Functions

Reusable server-side logic.

```sql
CREATE FUNCTION get_user_post_count(uid INT)
RETURNS INT AS $$
  SELECT COUNT(*) FROM posts WHERE user_id = uid;
$$ LANGUAGE sql;
```

Can return:

- Single values
- Rows / tables
- Void (for procedures)

---

## 🧰 Triggers vs Procedures

| Feature            | Trigger                | Procedure                  |
| ------------------ | ---------------------- | -------------------------- |
| Runs automatically | ✅                     | ❌                         |
| Called manually    | ❌                     | ✅                         |
| Common use         | Audit logs, timestamps | Business logic, automation |

---

## 🧾 For LBAW

Keep using:

- `create.sql` → table definitions & constraints
- `populate.sql` → initial test data
- Organize your schema logically
- Add comments to explain relationships & triggers

---

## 🎯 Summary

Today we covered:

- Constraints and foreign keys
- Views and indexes
- Triggers and stored procedures

Next time:
**Transactions, performance tuning, and testing your database logic!**

---

## 💬 Questions?
