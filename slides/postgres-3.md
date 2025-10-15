---
marp: true
title: "PostgreSQL Transactions & Performance"
theme: default
paginate: true
---

# ⚙️ PostgreSQL Transactions & Performance

### LBAW - Session 3

---

## 🔁 Quick Recap

Last time we learned:

- Constraints and foreign keys
- Views and indexes
- Triggers and stored procedures

Today’s focus:

1. Transactions & ACID
2. Performance tuning
3. Testing database logic

---

## 🧱 What Is a Transaction?

A **transaction** is a sequence of operations that act as a **single unit of work**.

If one operation fails → the entire transaction is rolled back.

Example:

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
```

💡 If any update fails → nothing changes in the database.

---

## 🧠 ACID Properties

| Property            | Description                                    |
| ------------------- | ---------------------------------------------- |
| **A - Atomicity**   | All or nothing                                 |
| **C - Consistency** | Database moves from one valid state to another |
| **I - Isolation**   | Concurrent transactions don’t interfere        |
| **D - Durability**  | Changes persist even after crashes             |

---

## 🧩 COMMIT vs ROLLBACK

```sql
BEGIN;
INSERT INTO users(name) VALUES ('Alice');
ROLLBACK; -- ❌ Undo changes
```

```sql
BEGIN;
INSERT INTO users(name) VALUES ('Bob');
COMMIT; -- ✅ Save permanently
```

Use `ROLLBACK` when something goes wrong.

---

## ⚙️ Savepoints

Savepoints **allow partial** rollbacks within a transaction.

```sql
BEGIN;
INSERT INTO users VALUES (1, 'Alice');
SAVEPOINT step1;

INSERT INTO users VALUES (2, 'Bob');
ROLLBACK TO step1; -- undo Bob

COMMIT;
```

💡 Useful for complex operations and debugging.

---

## 🧵 Transaction Isolation Levels

PostgreSQL supports several isolation levels:

| Level            | Description                               |
| ---------------- | ----------------------------------------- |
| READ UNCOMMITTED | (treated as READ COMMITTED in PostgreSQL) |
| READ COMMITTED   | Default - sees only committed data        |
| REPEATABLE READ  | Same data view within the transaction     |
| SERIALIZABLE     | Strictest - fully consistent, slower      |

Set with:

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

---

## ⚡ Query Performance

Let’s see how PostgreSQL executes queries.

```sql
EXPLAIN ANALYZE
SELECT * FROM posts WHERE user_id = 5;
```

Example output:

```
Index Scan using idx_user_id on posts  (cost=0.15..8.17 rows=3 width=36) (actual time=0.012..0.014 rows=2 loops=1)
  Index Cond: (user_id = 5)
Planning Time: 0.123 ms
Execution Time: 0.032 ms
```

💡 Use `EXPLAIN ANALYZE` to measure and improve performance.

---

## 📊 Sequential Scan vs Index Scan

| Scan Type       | Description               | When Used                     |
| --------------- | ------------------------- | ----------------------------- |
| **Seq Scan**    | Reads every row           | Small tables or missing index |
| **Index Scan**  | Uses an index             | Filtered or sorted queries    |
| **Bitmap Scan** | Combines multiple indexes | Complex conditions            |

---

## 🧰 Creating and Managing Indexes

```sql
CREATE INDEX idx_posts_user_id ON posts(user_id);
DROP INDEX idx_posts_user_id;
```

Indexes improve:

- SELECT queries
- JOIN operations
- ORDER BY performance

But they **slow down INSERT/UPDATE** - balance is key.

---

## 🔍 Measuring Query Time

Use `\timing` in `psql` to show query execution time.

```sql
\timing
SELECT * FROM posts WHERE user_id = 5;
```

Output:

```
Time: 0.035 ms
```

## 🧮 Caching & Query Planning

PostgreSQL caches:

- Query plans
- Recently accessed data pages

Good practices:

- Avoid overly complex queries
- Use LIMIT when possible
- Analyze your tables regularly:

```sql
ANALYZE posts;
```

## 🧪 Testing Database Logic

For LBAW, you’ll need to test your schema and data setup.

Example workflow:

- Run `create.sql`
- Run `populate.sql`
- Execute test queries
- Rollback after each test

Use:

```sql
BEGIN;
-- test data or logic
ROLLBACK;
```

---

## 🧑‍💻 Automating Tests

You can create SQL test scripts:

```sql
\i create.sql
\i populate.sql

BEGIN;
SELECT * FROM get_user_post_count(1);
ROLLBACK;
```

💡 Combine with `psql -f script.sql` for automation.

---

## 🧾 For LBAW Projects

Make sure your database:

- Supports transactions safely
- Has properly indexed relations
- Can be reset with `create.sql` + `populate.sql`
- Is easy to test and debug

---

## 🎯 Summary

Today we covered:

- Transactions & ACID
- Query performance & optimization
- Testing database logic

---

## 💬 Questions?
