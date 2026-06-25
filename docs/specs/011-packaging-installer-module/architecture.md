# /specs/011-packaging-installer-module/architecture.md

# Packaging & Installer Architecture

## Feature Structure

```text id="8xk2bc"
src-tauri/
  capabilities/
  icons/
  bundles/

  src/
    commands/
    services/
    migrations/
    bootstrap/
    updater/
    diagnostics/
```

---

# Layers

```text id="6zrybk"
Application Start
        ↓
Bootstrap Service
        ↓
Migration Service
        ↓
Database Initialization
        ↓
Settings Initialization
        ↓
Application Ready
```

---

# Build Targets

```text id="zhfucg"
Windows Installer (.msi)
Windows Executable (.exe)
Portable Version
```

---

# Services

```text id="h4ikpm"
BootstrapService
MigrationService
InstallerService
UpdaterService
DiagnosticsService
CrashRecoveryService
VersionService
```

---

# Integrations

Settings Module
↓
Load Application Settings

Database Module
↓
Initialize SQLite

Backup Module
↓
Restore Recovery Snapshots

Printing Module
↓
Restore Printer Profiles
