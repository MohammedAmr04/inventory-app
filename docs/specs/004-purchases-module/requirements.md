# /specs/004-purchases-module/requirements.md

# Spec 004 - Purchases Module

## Goal

Build a purchasing and stock inward management system that allows store owners to register supplier shipments, update inventory stock levels, and track supplier debts resulting from credit purchases.

This module connects Suppliers and Inventory and becomes the source of truth for all incoming stock.

---

# Business Goals

* Register incoming stock shipments.
* Increase inventory quantities automatically.
* Record product purchase prices.
* Track full and partial payments.
* Update supplier balances automatically.
* Maintain purchase history.

---

# User Stories

## Store Owner

* I can create purchase invoices.
* I can select a supplier.
* I can add products and quantities.
* I can enter purchase prices.
* I can partially pay invoices.
* I can review purchase history.
* I can print purchase invoices.
* I can see remaining supplier debt.

---

# Functional Requirements

## Purchase Invoices

* Create Purchase Invoice
* View Purchase Invoice
* Search Purchase Invoice
* Filter Purchase Invoice
* View Purchase History
* Print Purchase Invoice

## Purchase Items

* Add Products
* Remove Products
* Update Quantities
* Update Purchase Prices
* Calculate Totals

## Payments

* Full Payment
* Partial Payment
* Credit Purchase
* Due Amount Calculation

## Stock Management

* Increment Product Stock
* Record Stock Adjustments
* Maintain Purchase History

## Supplier Integration

* Update Supplier Balance
* Create Ledger Entry
* Link Purchases to Suppliers

---

# Non Functional Requirements

Invoice Creation:
< 500 milliseconds

Product Search:
instant

Invoice Search:
< 100 milliseconds

Support:
500,000+ purchase records

---

# Acceptance Criteria

✓ Purchase invoice creation works

✓ Stock updates correctly

✓ Partial payment works

✓ Supplier balance updates correctly

✓ Ledger entries generate correctly

✓ Purchase history works
