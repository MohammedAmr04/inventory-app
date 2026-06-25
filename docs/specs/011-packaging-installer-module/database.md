# /specs/011-packaging-installer-module/database.md

# Packaging Database Design

Packaging module does not own business tables.

It manages application metadata.

---

# Tables

```text id="od0y4z"
app_metadata
migration_history
```

---

# app_metadata

```text id="gnf0wa"
key
value
updated_at
```

---

# Example Records

```text id="m44u7m"
application.version
application.first_run
application.installed_at
database.version
last_backup_at
last_crash_at
```

---

# migration_history

```text id="31w4hb"
id
version
description
status
executed_at
duration
```

---

# Status

```text id="ol2h5v"
pending
completed
failed
rolled_back
```

---

# Migration Flow

```text id="ek6bux"
Application Start
        ↓
Read Database Version
        ↓
Execute Pending Migrations
        ↓
Validate Database
        ↓
Update Metadata
        ↓
Launch Application
```

Rollback on failure.
