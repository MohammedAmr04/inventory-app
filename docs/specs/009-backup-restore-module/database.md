# /specs/009-backup-restore-module/database.md

# Backup Database Design

## Tables

```text id="t8cg1l"
backup_history
```

---

# backup_history

```text id="ihc6w0"
id
file_name
file_path
file_size
backup_type
status
created_at
```

---

# Backup Types

```text id="h0pjya"
manual
automatic
imported
```

---

# Status

```text id="nrqkk8"
completed
failed
restored
deleted
```

---

# Indexes

```text id="b1ffnl"
backup_history.created_at
backup_history.backup_type
backup_history.status
```

---

# Default Backup Structure

```text id="x08v2z"
RetailX/
└── backups/
    ├── retailx-backup-2026-06-25-1200.zip
    ├── retailx-backup-2026-06-26-0900.zip
    └── ...
```

---

# Backup Contents

```text id="0f1gr2"
retailx.db
settings.json
metadata.json
```

---

# Restore Flow

```text id="lfsl1u"
Select Backup
      ↓
Validate Backup
      ↓
Create Temporary Snapshot
      ↓
Replace Database
      ↓
Reload Application State
      ↓
Mark Restore Completed
```

Rollback on failure.

---

# Metadata

```text id="w5j90s"
application_version
database_version
backup_date
created_by
checksum
```
