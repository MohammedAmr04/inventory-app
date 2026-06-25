# /specs/008-settings-module/architecture.md

# Settings Architecture

## Feature Structure

```text id="k2m0yh"
features/
  settings/
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

```text id="kyrwb7"
Settings Pages
      ↓
Feature Hooks
      ↓
Settings Services
      ↓
Settings Repository
      ↓
SQLite Database
      ↓
Filesystem APIs
```

---

# Pages

```text id="k4vmns"
/settings
/settings/store
/settings/tax
/settings/currency
/settings/receipts
/settings/appearance
/settings/language
/settings/pos
```

---

# Components

```text id="9fjlwm"
settings-tabs
store-form
logo-upload
tax-settings-form
currency-settings-form
receipt-settings-form
appearance-settings-form
language-settings-form
pos-settings-form
restore-defaults-dialog
```

---

# Stores

```text id="1yr3a0"
settings-store
appearance-store
locale-store
receipt-store
```

---

# Hooks

```text id="s6uc7f"
useSettings
useStoreSettings
useTaxSettings
useCurrencySettings
useReceiptSettings
useAppearanceSettings
useLanguageSettings
usePosSettings
```

---

# Services

```text id="xq4l4n"
SettingsService
StoreSettingsService
TaxSettingsService
CurrencySettingsService
ReceiptSettingsService
AppearanceSettingsService
LanguageSettingsService
PosSettingsService
```

---

# Repositories

```text id="cwpgv2"
SettingsRepository
```

---

# Integrations

POS Module
↓
Tax Configuration
Receipt Configuration

Printing Module
↓
Store Information
Receipt Template

Reports Module
↓
Currency Formatting

i18n Module
↓
Language Configuration
