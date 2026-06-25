# /specs/005-pos-module/requirements.md

# Spec 005 - POS Module

## Goal

Build a high-performance Point of Sale (POS) system optimized for supermarkets and retail stores.

The POS must support barcode scanning, keyboard-driven workflows, instant checkout, receipt printing, and real-time inventory updates while remaining fully offline.

The cashier should never need to leave the POS screen during a sale.

---

# Business Goals

* Fast checkout experience
* Minimize cashier actions
* Support barcode scanning
* Support keyboard shortcuts
* Print receipts
* Maintain inventory accuracy
* Handle large transaction volumes
* Operate completely offline

---

# User Stories

## Cashier

* I can scan products by barcode.
* I can search products by name.
* I can update quantities quickly.
* I can remove products.
* I can apply discounts.
* I can hold invoices.
* I can resume invoices.
* I can settle payments.
* I can print receipts.
* I can finish a sale without leaving the POS screen.

## Store Owner

* I can review sales history.
* I can track payment methods.
* I can trust inventory quantities after every sale.

---

# Functional Requirements

## Product Search

* Barcode Search
* Product Search
* Auto Focus Search Input
* Keyboard Navigation

## Cart

* Add Product
* Remove Product
* Update Quantity
* Update Price
* Apply Discount
* Clear Cart

## Checkout

* Cash Payment
* Card Payment
* Mixed Payment
* Change Calculation
* Invoice Creation
* Receipt Printing

## Invoice Management

* Hold Invoice
* Resume Invoice
* Print Last Invoice
* View Invoice History

## Inventory

* Deduct Product Stock
* Ignore Service Products
* Prevent Negative Stock

## Hardware

* Barcode Scanner
* Thermal Printer

---

# Keyboard Shortcuts

F1
Focus Search

F2
Hold Invoice

F3
Print Last Receipt

F4
Clear Cart

F12
Settle Payment

Enter
Confirm Payment

Esc
Close Dialogs

---

# Non Functional Requirements

Barcode Scan:
instant

Product Search:
< 100 milliseconds

Checkout:
< 1 second

Invoice Creation:
< 500 milliseconds

Receipt Printing:
< 2 seconds

Support:
500,000+ sales invoices

---

# Acceptance Criteria

✓ Barcode search works

✓ Cart management works

✓ Hold invoice works

✓ Resume invoice works

✓ Payment dialog works

✓ Receipt printing works

✓ Stock deduction works

✓ Keyboard shortcuts work
