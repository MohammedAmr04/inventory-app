# /specs/009-backup-restore-module/architecture.md

# Backup & Restore Architecture

## Feature Structure

```text id="g6fx8p"
features/
  backup/
    components/
    hooks/
    services/
    repositories/
    schemas/
    stores/
    types/
    constants/
    utils/
```

---

# Layers

```text id="0gc1po"
Backup Pages
      ↓
Feature Hooks
      ↓
Backup Services
      ↓
Filesystem Service
      ↓
SQLite Database
      ↓
Tauri Native APIs
```

---

# Pages

```text id="4otgcn"
/settings/backups
/settings/backups/history
```

---

# Components

```text id="a5qv9h"
backup-settings-form
backup-history-table
create-backup-button
restore-backup-dialog
import-backup-dialog
export-backup-dialog
directory-picker
backup-card
```

---

# Stores

```text id="ap0d9m"
backup-store
backup-history-store
backup-settings-store
```

---

# Hooks

```text id="3x8g5i"
useBackups
useBackupHistory
useBackupSettings
useRestore
```

---

# Services

```text id="gyygl9"
BackupService
RestoreService
BackupValidationService
BackupCompressionService
BackupSchedulerService
```

---

# Repositories

```text id="m12rz0"
BackupRepository
```

---

# Integrations

Filesystem Module
↓
Create Backup Files

Database Module
↓
Read Database File

Settings Module
↓
Backup Configuration
