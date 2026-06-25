# /specs/008-settings-module/database.md

# Settings Database Design

## Tables

```text id="mvr1yc"
settings
```

---

# settings

```text id="44ynlg"
key
value
updated_at
```

---

# Example Records

```text id="qwvzkx"
store.name
store.phone
store.address
store.email
store.logo

tax.enabled
tax.rate
tax.mode

currency.name
currency.symbol
currency.precision

receipt.header
receipt.footer
receipt.show_logo
receipt.show_tax
receipt.paper_width

appearance.theme
appearance.accent_color
appearance.font_size

locale.language
locale.rtl

pos.auto_focus
pos.auto_print
pos.allow_negative_stock
pos.hold_expiration
pos.default_payment_method
```

---

# Indexes

```text id="3mg0wc"
settings.key
```

---

# Persistence Rules

```text id="4kt5i2"
Application Startup
        ↓
Load Settings
        ↓
Hydrate Stores
        ↓
Apply Configurations
```

---

# Save Rules

```text id="kh7xj8"
Update Setting
        ↓
Persist To SQLite
        ↓
Update Store State
        ↓
Notify Subscribers
```

---

# Restore Defaults

```text id="8m0k2h"
Delete User Overrides
        ↓
Load Default Configuration
        ↓
Persist Defaults
        ↓
Reload Settings Store
```
