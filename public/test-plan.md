# GizmoStock Sync POS — Comprehensive Test Plan Document

**Version:** 2.0  
**Date:** 2026-02-22  
**Prepared By:** QA Engineering Team  
**System Under Test:** GizmoStock Sync POS  
**Document Classification:** Internal — Confidential  

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Purpose and Objectives](#2-purpose-and-objectives)
3. [Scope of Testing](#3-scope-of-testing)
4. [Test Environment](#4-test-environment)
5. [Test Strategy](#5-test-strategy)
6. [Roles and Responsibilities](#6-roles-and-responsibilities)
7. [Test Cases — Authentication Module](#7-test-cases--authentication-module)
8. [Test Cases — Role-Based Access Control (RBAC)](#8-test-cases--role-based-access-control-rbac)
9. [Test Cases — Product Management](#9-test-cases--product-management)
10. [Test Cases — Category Management](#10-test-cases--category-management)
11. [Test Cases — Supplier Management](#11-test-cases--supplier-management)
12. [Test Cases — Sales Processing](#12-test-cases--sales-processing)
13. [Test Cases — Dashboard & Analytics](#13-test-cases--dashboard--analytics)
14. [Test Cases — Reports Module](#14-test-cases--reports-module)
15. [Test Cases — User Management](#15-test-cases--user-management)
16. [Test Cases — Settings & Profile Management](#16-test-cases--settings--profile-management)
17. [Database & Data Integrity Testing](#17-database--data-integrity-testing)
18. [Security Testing](#18-security-testing)
19. [API & Edge Function Testing](#19-api--edge-function-testing)
20. [UI/UX & Usability Testing](#20-uiux--usability-testing)
21. [Mobile Responsiveness Testing](#21-mobile-responsiveness-testing)
22. [Performance Testing](#22-performance-testing)
23. [Integration Testing](#23-integration-testing)
24. [Regression Testing](#24-regression-testing)
25. [Error Handling & Edge Cases](#25-error-handling--edge-cases)
26. [Test Data Requirements](#26-test-data-requirements)
27. [Defect Management](#27-defect-management)
28. [Risk Assessment](#28-risk-assessment)
29. [Entry & Exit Criteria](#29-entry--exit-criteria)
30. [Test Schedule](#30-test-schedule)
31. [Approvals & Sign-Off](#31-approvals--sign-off)

---

## 1. Introduction

The GizmoStock Sync POS system is a comprehensive Point of Sale and Inventory Management application designed for retail businesses. It provides functionalities for managing products, processing sales transactions (both cash and digital payments via Paystack), tracking inventory levels, managing suppliers, generating reports, and administering users with role-based access control.

This document serves as the master test plan for the GizmoStock Sync POS system. It defines the testing approach, scope, resources, schedule, and activities required to validate all functional and non-functional requirements of the system. The test plan ensures that every module meets quality standards before deployment to production.

The system is built using a modern web technology stack consisting of React 18 with TypeScript on the frontend, Lovable Cloud as the backend service (providing database, authentication, edge functions, and storage), and Paystack as the payment gateway. The application follows a single-page architecture with client-side routing and real-time data synchronization.

---

## 2. Purpose and Objectives

### 2.1 Purpose

The purpose of this test plan is to:

- Define the scope, approach, and methodology for testing the GizmoStock Sync POS system
- Identify all testable features and functionalities across every module
- Establish clear pass/fail criteria for each test case
- Document the test environment, tools, and data requirements
- Provide a structured framework for tracking defects and measuring test progress
- Ensure compliance with business requirements and security standards

### 2.2 Testing Objectives

| Objective | Description | Priority |
|---|---|---|
| Functional Validation | Verify that all features work according to business requirements | Critical |
| Security Assurance | Ensure Row Level Security (RLS) policies, authentication, and authorization are properly enforced | Critical |
| Data Integrity | Confirm that all CRUD operations maintain data consistency across related tables | Critical |
| Payment Processing | Validate both cash and Paystack payment flows including edge cases | High |
| Role-Based Access | Verify that users can only access features permitted by their assigned role | High |
| Usability | Ensure the UI is intuitive, responsive, and accessible across devices | Medium |
| Performance | Validate acceptable load times and responsiveness under normal usage | Medium |
| Error Handling | Confirm graceful error handling for invalid inputs, network failures, and edge cases | High |

### 2.3 Out of Scope

The following items are explicitly excluded from this test plan:

| Item | Reason |
|---|---|
| Load/stress testing (>1000 concurrent users) | Requires dedicated performance testing infrastructure |
| Penetration testing | Will be conducted separately by a security audit team |
| Third-party Paystack infrastructure reliability | Outside the system's control |
| Browser extensions and ad blocker compatibility | Not a core requirement |
| Offline mode functionality | Not currently implemented |

---

## 3. Scope of Testing

### 3.1 Modules Under Test

The following table provides a detailed breakdown of all modules and the specific features that will be tested within each module:

| Module | Features Under Test | Test Types |
|---|---|---|
| **Authentication** | Email/password login, session persistence, logout, redirect to protected routes, error handling for invalid credentials | Functional, Security, UI |
| **Role-Based Access Control** | Admin full access, Manager restricted access (no Users), Cashier restricted access (no Users/Reports/Categories/Suppliers/Settings), navigation link visibility per role, RoleGuard component behavior | Functional, Security |
| **Product Management** | Create product with all fields, edit existing product, delete product with confirmation, search/filter by name, filter by category, SKU uniqueness validation, low stock visual indicator, category and supplier association | Functional, Data Integrity, UI |
| **Category Management** | Create category, edit category, delete category with confirmation, duplicate name validation | Functional, Data Integrity |
| **Supplier Management** | Create supplier with all fields, edit supplier, delete supplier, search suppliers, required field validation, contact information management | Functional, Data Integrity, UI |
| **Sales Processing** | Create cash sale, create Paystack sale with redirect/callback, invoice number generation, stock deduction after sale, multi-item sales, quantity validation against stock, empty cart validation, sale details viewing | Functional, Integration, Data Integrity |
| **Dashboard** | KPI cards (total products, sales, revenue, profit), sales trend chart, low stock alerts, real-time data refresh | Functional, UI |
| **Reports** | Sales report display, date range filtering, role-based access restriction | Functional, UI |
| **User Management** | Create user via edge function, edit user role, delete user via edge function, user listing with roles and status | Functional, Security |
| **Settings** | Profile management, system configuration (admin only) | Functional, UI |
| **Paystack Integration** | Payment initialization via edge function, callback URL handling, payment verification, amount validation, sale completion after verification | Integration, Security |

### 3.2 Database Schema Overview

Understanding the database schema is critical for designing effective test cases. The system uses the following tables:

| Table | Key Columns | Relationships | Purpose |
|---|---|---|---|
| `profiles` | id (UUID), email, full_name, phone, created_at, updated_at | id references auth.users | Stores user profile information |
| `user_roles` | id (UUID), user_id, role (enum: admin/manager/cashier), created_at | user_id references profiles | Assigns roles to users for RBAC |
| `products` | id (UUID), name, sku, cost_price, selling_price, quantity, reorder_level, category_id, supplier_id | category_id → categories, supplier_id → suppliers | Product inventory records |
| `categories` | id (UUID), name, description, created_at | Referenced by products | Product categorization |
| `suppliers` | id (UUID), company_name, contact_person, email, phone, address, products_supplied | Referenced by products | Supplier information |
| `sales` | id (UUID), invoice_no, total_amount, payment_method, clerk_id, created_at | clerk_id → profiles | Sales transaction records |
| `sales_items` | id (UUID), sale_id, product_id, quantity, unit_price, subtotal | sale_id → sales, product_id → products | Individual items in a sale |

---

## 4. Test Environment

### 4.1 Technology Stack

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Frontend Framework | React | 18.3.1 | UI rendering and component architecture |
| Build Tool | Vite | Latest | Development server and production bundling |
| Language | TypeScript | Latest | Type-safe JavaScript development |
| CSS Framework | Tailwind CSS | Latest | Utility-first styling with custom design system |
| UI Components | shadcn/ui (Radix UI) | Latest | Accessible component primitives |
| State Management | TanStack React Query | 5.x | Server state management and caching |
| Routing | React Router DOM | 6.30.x | Client-side routing |
| Backend | Lovable Cloud | Latest | Database, authentication, edge functions, storage |
| Payment Gateway | Paystack | Test Mode | Digital payment processing |
| Charts | Recharts | 2.15.x | Data visualization on dashboard |
| Form Handling | React Hook Form + Zod | Latest | Form state management and validation |

### 4.2 Browser Compatibility Matrix

| Browser | Version | OS | Priority |
|---|---|---|---|
| Google Chrome | Latest stable | Windows 10/11, macOS, Ubuntu | Critical |
| Mozilla Firefox | Latest stable | Windows 10/11, macOS | High |
| Apple Safari | Latest stable | macOS, iOS | High |
| Microsoft Edge | Latest stable (Chromium) | Windows 10/11 | Medium |
| Samsung Internet | Latest stable | Android | Low |

### 4.3 Device & Viewport Testing Matrix

| Device Category | Resolution | Orientation | Priority |
|---|---|---|---|
| Desktop (Full HD) | 1920 × 1080 | Landscape | Critical |
| Desktop (Standard) | 1366 × 768 | Landscape | High |
| Laptop | 1280 × 720 | Landscape | High |
| Tablet (iPad Pro) | 1024 × 768 | Both | Medium |
| Tablet (iPad) | 768 × 1024 | Both | Medium |
| Mobile (iPhone 14/15) | 390 × 844 | Portrait | High |
| Mobile (iPhone SE) | 375 × 812 | Portrait | Medium |
| Mobile (Android) | 360 × 800 | Portrait | Medium |
| Mobile (Small) | 320 × 568 | Portrait | Low |

### 4.4 Test Accounts

| Role | Email | Purpose |
|---|---|---|
| Admin | admin@gizmoke.com | Full system access testing |
| Manager | manager@gizmoke.com | Restricted access testing (no user management) |
| Cashier | cashier@gizmoke.com | Limited access testing (sales and products only) |
| New User | newuser@gizmoke.com | Fresh registration and onboarding testing |

---

## 5. Test Strategy

### 5.1 Testing Levels

| Level | Description | Responsibility |
|---|---|---|
| **Unit Testing** | Individual hooks, utility functions, and component logic tested in isolation | Developers |
| **Integration Testing** | Interactions between frontend components and backend APIs, database operations, and payment gateway | QA Team |
| **System Testing** | End-to-end testing of complete user workflows across all modules | QA Team |
| **Regression Testing** | Re-execution of critical test cases after bug fixes or feature changes | QA Team |
| **User Acceptance Testing (UAT)** | Business stakeholder validation of real-world scenarios | Business Users |

### 5.2 Testing Types

| Type | Description | Tools |
|---|---|---|
| Functional Testing | Verify each feature works as specified | Manual + Automated |
| Security Testing | Validate RLS policies, authentication, and authorization | Manual + SQL queries |
| Usability Testing | Evaluate UI/UX across devices and screen sizes | Manual |
| Performance Testing | Measure page load times, API response times | Browser DevTools, Lighthouse |
| Compatibility Testing | Verify cross-browser and cross-device behavior | BrowserStack / Manual |
| API Testing | Test edge functions (create-user, delete-user, paystack-initialize, paystack-verify) | cURL / Postman |

### 5.3 Defect Severity Classification

| Severity | Description | Example | Response Time |
|---|---|---|---|
| **S1 — Critical** | System crash, data loss, security breach, payment failure | Login completely broken, RLS policy missing | Immediate fix |
| **S2 — High** | Major feature non-functional, significant data inconsistency | Sale doesn't deduct stock, role guard bypassed | Fix within 24 hours |
| **S3 — Medium** | Feature partially works, workaround available | Search filter not returning all results | Fix within 3 days |
| **S4 — Low** | Minor UI issue, cosmetic defect | Misaligned button, typo in label | Fix in next sprint |

---

## 6. Roles and Responsibilities

| Role | Person | Responsibilities |
|---|---|---|
| QA Lead | TBD | Test planning, test case review, defect triage, test reporting |
| QA Engineer(s) | TBD | Test case execution, defect logging, regression testing |
| Developer(s) | TBD | Unit testing, bug fixing, code reviews, technical support for QA |
| Project Manager | TBD | Schedule coordination, stakeholder communication, risk management |
| Business Analyst | TBD | Requirements clarification, UAT coordination |
| DevOps | TBD | Test environment setup and maintenance |

---

## 7. Test Cases — Authentication Module

This module validates the login/logout functionality, session management, and protected route enforcement. The system uses email/password authentication with session tokens managed by the backend.

### 7.1 Login Functionality

| ID | Test Case | Preconditions | Steps | Test Data | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|---|
| AUTH-01 | Login with valid credentials | User account exists and is active | 1. Navigate to /auth 2. Enter valid email 3. Enter valid password 4. Click "Login" button | email: admin@gizmoke.com, password: ValidPass123! | User is authenticated and redirected to /dashboard. Toast notification not shown for success. Session token stored. | Critical | — |
| AUTH-02 | Login with incorrect password | User account exists | 1. Navigate to /auth 2. Enter valid email 3. Enter incorrect password 4. Click "Login" | email: admin@gizmoke.com, password: WrongPass! | Error toast displayed: "Login failed" with descriptive message. User remains on /auth page. No session created. | Critical | — |
| AUTH-03 | Login with non-existent email | No account for email | 1. Navigate to /auth 2. Enter unregistered email 3. Enter any password 4. Click "Login" | email: nobody@test.com, password: AnyPass123! | Error toast displayed. User remains on /auth. No information leakage about account existence. | Critical | — |
| AUTH-04 | Login with empty email field | On /auth page | 1. Leave email field empty 2. Enter password 3. Click "Login" | email: (empty), password: Test123! | HTML5 validation prevents form submission. "required" attribute enforced. | High | — |
| AUTH-05 | Login with empty password field | On /auth page | 1. Enter email 2. Leave password field empty 3. Click "Login" | email: admin@gizmoke.com, password: (empty) | HTML5 validation prevents form submission. "required" attribute enforced. | High | — |
| AUTH-06 | Login with invalid email format | On /auth page | 1. Enter "notanemail" in email field 2. Enter password 3. Click "Login" | email: notanemail, password: Test123! | HTML5 email validation prevents submission. Browser shows format error. | Medium | — |
| AUTH-07 | Login button loading state | On /auth page | 1. Enter valid credentials 2. Click "Login" 3. Observe button state during request | Valid credentials | Button text changes to "Logging in..." and button is disabled during the API call. Prevents duplicate submissions. | Medium | — |

### 7.2 Session Management

| ID | Test Case | Preconditions | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| AUTH-08 | Session persistence across tab close | User is logged in | 1. Login successfully 2. Close the browser tab 3. Open a new tab and navigate to the app | User remains logged in and is redirected to /dashboard. Session token retrieved from storage. | Critical | — |
| AUTH-09 | Session persistence across page refresh | User is logged in | 1. Login successfully 2. Navigate to /products 3. Press F5 to refresh | Page reloads on /products with user still authenticated. Data reloaded from backend. | Critical | — |
| AUTH-10 | Already authenticated user visits /auth | User is logged in | 1. Login successfully 2. Manually navigate to /auth | User is automatically redirected to /dashboard. Login form is not displayed. | High | — |
| AUTH-11 | Session expiration handling | User session has expired | 1. Login successfully 2. Wait for session to expire (or manually clear token) 3. Attempt to navigate | User is redirected to /auth. Protected routes are not accessible. | High | — |

### 7.3 Logout Functionality

| ID | Test Case | Preconditions | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| AUTH-12 | Successful logout | User is logged in | 1. Click the logout button in the navigation 2. Observe redirect | User is redirected to /auth. Session is cleared. All cached data is invalidated. | Critical | — |
| AUTH-13 | Access protected route after logout | User has just logged out | 1. Logout 2. Press browser back button 3. Try to navigate to /dashboard | User is redirected to /auth. Protected content is not visible. No stale data shown. | Critical | — |
| AUTH-14 | Logout from different pages | User is logged in | 1. Navigate to /products 2. Logout 3. Login again 4. Navigate to /sales 5. Logout | Logout works consistently from any page. Always redirects to /auth. | High | — |

### 7.4 Protected Route Access

| ID | Test Case | Preconditions | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| AUTH-15 | Unauthenticated access to /dashboard | User is NOT logged in | 1. Open browser 2. Navigate directly to /dashboard | User is redirected to /auth page. Dashboard content not rendered. | Critical | — |
| AUTH-16 | Unauthenticated access to /products | User is NOT logged in | Navigate directly to /products | Redirected to /auth | Critical | — |
| AUTH-17 | Unauthenticated access to /sales | User is NOT logged in | Navigate directly to /sales | Redirected to /auth | Critical | — |
| AUTH-18 | Unauthenticated access to /users | User is NOT logged in | Navigate directly to /users | Redirected to /auth | Critical | — |
| AUTH-19 | Unauthenticated access to /reports | User is NOT logged in | Navigate directly to /reports | Redirected to /auth | Critical | — |
| AUTH-20 | Unauthenticated access to /settings | User is NOT logged in | Navigate directly to /settings | Redirected to /auth | High | — |

---

## 8. Test Cases — Role-Based Access Control (RBAC)

The system implements three roles: **Admin**, **Manager**, and **Cashier**. Each role has specific permissions that control which routes and features are accessible. The `RoleGuard` component wraps protected routes and checks the user's role before rendering content.

### 8.1 Role-Route Access Matrix

This matrix defines the expected access for each role across all routes. "✅" indicates access is granted, "❌" indicates access is denied and an "Access Denied" screen with a shield icon is shown.

| Route | Page | Admin | Manager | Cashier | Guard Component |
|---|---|---|---|---|---|
| /dashboard | Dashboard | ✅ | ✅ | ✅ | ProtectedRoute only |
| /products | Products | ✅ | ✅ | ✅ | ProtectedRoute only |
| /categories | Categories | ✅ | ✅ | ❌ | ProtectedRoute + RoleGuard(admin, manager) |
| /sales | Sales | ✅ | ✅ | ✅ | ProtectedRoute only |
| /reports | Reports | ✅ | ✅ | ❌ | ProtectedRoute + RoleGuard(admin, manager) |
| /users | User Management | ✅ | ❌ | ❌ | ProtectedRoute + RoleGuard(admin) |
| /suppliers | Suppliers | ✅ | ✅ | ❌ | ProtectedRoute + RoleGuard(admin, manager) |
| /settings | Settings | ✅ | ❌ | ❌ | ProtectedRoute + RoleGuard(admin) |

### 8.2 Admin Role Test Cases

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|
| RBAC-01 | Admin accesses all routes | 1. Login as admin 2. Navigate to each route: /dashboard, /products, /categories, /sales, /reports, /users, /suppliers, /settings | All pages render correctly with full content. No "Access Denied" screen shown on any route. | Critical | — |
| RBAC-02 | Admin sees all navigation links | 1. Login as admin 2. Inspect sidebar navigation | All menu items visible: Dashboard, Products, Categories, Sales, Reports, Users, Suppliers, Settings, Logout | High | — |
| RBAC-03 | Admin can perform all CRUD operations | 1. Login as admin 2. Create, edit, delete items in Products, Categories, Suppliers, Users | All operations succeed without permission errors | Critical | — |

### 8.3 Manager Role Test Cases

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|
| RBAC-04 | Manager accesses allowed routes | 1. Login as manager 2. Navigate to /dashboard, /products, /categories, /sales, /reports, /suppliers | Pages render correctly with full content | Critical | — |
| RBAC-05 | Manager denied access to /users | 1. Login as manager 2. Navigate to /users | "Access Denied" screen displayed with shield icon, title "Access Denied", and message "You don't have permission to access this page." | Critical | — |
| RBAC-06 | Manager denied access to /settings | 1. Login as manager 2. Navigate to /settings | "Access Denied" screen displayed | Critical | — |
| RBAC-07 | Manager navigation link visibility | 1. Login as manager 2. Inspect sidebar | Users and Settings links should be hidden from navigation | High | — |

### 8.4 Cashier Role Test Cases

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|
| RBAC-08 | Cashier accesses allowed routes | 1. Login as cashier 2. Navigate to /dashboard, /products, /sales | Pages render correctly | Critical | — |
| RBAC-09 | Cashier denied access to /users | 1. Login as cashier 2. Navigate to /users | "Access Denied" screen displayed | Critical | — |
| RBAC-10 | Cashier denied access to /reports | 1. Login as cashier 2. Navigate to /reports | "Access Denied" screen displayed | Critical | — |
| RBAC-11 | Cashier denied access to /categories | 1. Login as cashier 2. Navigate to /categories | "Access Denied" screen displayed | Critical | — |
| RBAC-12 | Cashier denied access to /suppliers | 1. Login as cashier 2. Navigate to /suppliers | "Access Denied" screen displayed | Critical | — |
| RBAC-13 | Cashier denied access to /settings | 1. Login as cashier 2. Navigate to /settings | "Access Denied" screen displayed | Critical | — |
| RBAC-14 | Cashier navigation link visibility | 1. Login as cashier 2. Inspect sidebar | Only Dashboard, Products, Sales, and Logout links visible. Categories, Reports, Users, Suppliers, Settings links hidden. | High | — |

### 8.5 RoleGuard Component Behavior

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|
| RBAC-15 | Loading state during role check | 1. Login 2. Navigate to a role-guarded route 3. Observe during role fetch | Skeleton loader displayed while role is being fetched from the database. No flash of "Access Denied" before role loads. | Medium | — |
| RBAC-16 | User with no role assigned | 1. Create user without assigning a role 2. Login 3. Navigate to any role-guarded route | "Access Denied" screen shown. User can only access non-guarded routes (dashboard, products, sales). | High | — |
| RBAC-17 | Role change takes effect immediately | 1. Login as cashier 2. Admin changes user role to manager 3. Cashier refreshes page 4. Navigate to /reports | After refresh, user should have manager access and /reports should load successfully. | Medium | — |

---

## 9. Test Cases — Product Management

The Product Management module allows users to create, read, update, and delete products. Each product has a unique SKU, pricing (cost and selling), quantity tracking, reorder level for low-stock alerts, and optional associations to a category and supplier.

### 9.1 Create Product

| ID | Test Case | Preconditions | Steps | Test Data | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|---|
| PROD-01 | Create product with all fields | Logged in, categories and suppliers exist | 1. Click "Add Product" button 2. Fill all fields 3. Click Submit | name: "Laptop Stand", sku: "LS-001", cost: 1500, selling: 2500, qty: 50, reorder: 10, category: "Electronics", supplier: "TechCo" | Product appears in product list. Toast: "Product created successfully". All field values match input. | Critical | — |
| PROD-02 | Create product with required fields only | Logged in | 1. Click "Add Product" 2. Fill only name, SKU, cost price, selling price 3. Submit | name: "Basic Item", sku: "BI-001", cost: 100, selling: 200 | Product created with default quantity (0) and reorder level (0). No category or supplier associated. | High | — |
| PROD-03 | Create product with duplicate SKU | Product with SKU "LS-001" exists | 1. Click "Add Product" 2. Enter existing SKU "LS-001" 3. Fill other fields 4. Submit | sku: "LS-001" | Error toast displayed: "Failed to create product" with message about duplicate SKU. Product not created. | Critical | — |
| PROD-04 | Create product with empty required fields | Logged in | 1. Click "Add Product" 2. Leave all fields empty 3. Try to submit | All fields empty | Form validation prevents submission. Required field indicators shown. | High | — |
| PROD-05 | Create product with negative prices | Logged in | 1. Click "Add Product" 2. Enter negative cost/selling price 3. Submit | cost: -100, selling: -50 | Validation error or product rejected. Negative prices should not be stored. | Medium | — |
| PROD-06 | Create product with selling price less than cost | Logged in | 1. Click "Add Product" 2. Enter cost > selling price 3. Submit | cost: 500, selling: 200 | Product can be created (business may sell at a loss intentionally) but no crash occurs. | Low | — |
| PROD-07 | Cancel product creation | Logged in, dialog open | 1. Click "Add Product" 2. Fill some fields 3. Close dialog without submitting | — | Dialog closes. No product created. Form state reset. | Medium | — |

### 9.2 Read/List Products

| ID | Test Case | Preconditions | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| PROD-08 | View product list | Logged in, products exist | 1. Navigate to /products | Product table displays with columns: Name, SKU, Category, Price, Stock, Status, Actions. Data loaded from database. | Critical | — |
| PROD-09 | Loading state for product list | Logged in | 1. Navigate to /products 2. Observe while data loads | Skeleton loaders displayed in table rows until data is fetched. No blank table shown. | Medium | — |
| PROD-10 | Empty product list | Logged in, no products in database | 1. Navigate to /products | "No products found" message displayed in table body. No errors. | Medium | — |
| PROD-11 | Search products by name | Products exist | 1. Navigate to /products 2. Type "Laptop" in search bar | Only products containing "Laptop" in their name are shown. Search is case-insensitive. | High | — |
| PROD-12 | Filter products by category | Products with different categories exist | 1. Navigate to /products 2. Select a category from the filter dropdown | Only products belonging to the selected category are displayed. | High | — |
| PROD-13 | Clear search/filter | Active search or filter applied | 1. Clear the search input or reset the filter | Full product list restored. | Medium | — |
| PROD-14 | Low stock indicator | Products with quantity ≤ reorder_level exist | 1. Navigate to /products 2. Locate a low-stock product | Product row displays a visual low-stock warning badge/indicator. Clearly distinguishable from normal stock. | High | — |

### 9.3 Update Product

| ID | Test Case | Preconditions | Steps | Test Data | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|---|
| PROD-15 | Edit product — change name | Product exists | 1. Click edit on a product 2. Change the name 3. Save | New name: "Updated Laptop Stand" | Product list reflects the updated name. Toast: "Product updated successfully". | Critical | — |
| PROD-16 | Edit product — change price | Product exists | 1. Click edit 2. Update selling_price 3. Save | New selling_price: 3000 | Price updated in list. Database reflects new value. | Critical | — |
| PROD-17 | Edit product — change category | Product exists, multiple categories exist | 1. Click edit 2. Select different category 3. Save | New category: "Accessories" | Category association updated. Product appears under new category when filtered. | High | — |
| PROD-18 | Edit product — change quantity | Product exists | 1. Click edit 2. Update quantity 3. Save | New quantity: 100 | Quantity updated. Low stock indicator removed if new quantity > reorder_level. | High | — |
| PROD-19 | Edit product — cancel without saving | Edit dialog open with changes | 1. Make changes 2. Close dialog without saving | Original values preserved. No database update made. | Medium | — |

### 9.4 Delete Product

| ID | Test Case | Preconditions | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| PROD-20 | Delete product with confirmation | Product exists | 1. Click delete button on product 2. Confirm deletion in dialog | Product removed from list. Toast: "Product deleted successfully". Database record deleted. | Critical | — |
| PROD-21 | Cancel product deletion | Delete confirmation dialog open | 1. Click delete 2. Click "Cancel" in confirmation dialog | Product remains in list. No database change. | High | — |
| PROD-22 | Delete product with existing sales items | Product has been used in past sales | 1. Attempt to delete product linked to sales_items | Either: foreign key error displayed OR product is soft-deleted/archived. Data integrity maintained. | Critical | — |

---

## 10. Test Cases — Category Management

Categories are used to organize products. Only Admin and Manager roles can access the Categories module. Each category has a name and an optional description.

| ID | Test Case | Preconditions | Steps | Test Data | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|---|
| CAT-01 | Create category with name and description | Logged in as admin/manager | 1. Navigate to /categories 2. Click "Add Category" 3. Enter name and description 4. Submit | name: "Electronics", desc: "Electronic gadgets and accessories" | Category appears in the list. Toast: "Category created successfully". | Critical | — |
| CAT-02 | Create category with name only | Logged in as admin/manager | 1. Click "Add Category" 2. Enter name only 3. Submit | name: "Furniture" | Category created. Description field is null in database. | High | — |
| CAT-03 | Create category with empty name | Logged in as admin/manager | 1. Click "Add Category" 2. Leave name empty 3. Try to submit | name: (empty) | Validation prevents submission. Name is required. | High | — |
| CAT-04 | Create category with duplicate name | Category "Electronics" exists | 1. Click "Add Category" 2. Enter "Electronics" 3. Submit | name: "Electronics" | Error toast displayed. Duplicate category not created. | High | — |
| CAT-05 | Edit category name | Category exists | 1. Click edit on category 2. Change name 3. Save | New name: "Electronic Devices" | Category name updated in list and in any product associations. | Critical | — |
| CAT-06 | Edit category description | Category exists | 1. Click edit 2. Change description 3. Save | New description: "Updated desc" | Description updated in database. | Medium | — |
| CAT-07 | Delete category | Category exists, not linked to products | 1. Click delete 2. Confirm | — | Category removed from list. Toast: "Category deleted successfully". | Critical | — |
| CAT-08 | Delete category linked to products | Category has associated products | 1. Click delete on category with products 2. Confirm | — | Either: error displayed (foreign key constraint) OR products' category_id set to null. Data integrity maintained. | Critical | — |
| CAT-09 | Category list ordering | Multiple categories exist | 1. Navigate to /categories | Categories displayed in alphabetical order by name. | Medium | — |

---

## 11. Test Cases — Supplier Management

The Supplier Management module allows tracking of product suppliers including their contact details and supplied products. Only Admin and Manager roles have access.

| ID | Test Case | Preconditions | Steps | Test Data | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|---|
| SUP-01 | Create supplier with all fields | Logged in as admin/manager | 1. Navigate to /suppliers 2. Click "Add Supplier" 3. Fill all fields 4. Submit | company: "TechCo Ltd", contact: "John Doe", email: "john@techco.com", phone: "+254700000000", address: "Nairobi CBD", products: "Laptops, Monitors" | Supplier appears in list. All fields populated. Toast success. | Critical | — |
| SUP-02 | Create supplier with required fields only | Logged in | 1. Click "Add Supplier" 2. Fill only required fields 3. Submit | company: "QuickSupply", contact: "Jane", email: "jane@qs.com", phone: "+254711111111" | Supplier created. Optional fields (address, products_supplied) are null. | High | — |
| SUP-03 | Create supplier with missing required fields | Logged in | 1. Click "Add Supplier" 2. Leave company_name empty 3. Submit | company: (empty) | Validation prevents submission. Error indicators shown on required fields. | High | — |
| SUP-04 | Edit supplier details | Supplier exists | 1. Click edit on supplier 2. Update phone number 3. Save | New phone: "+254722222222" | Phone updated in list and database. Toast success. | Critical | — |
| SUP-05 | Delete supplier | Supplier exists, not linked to products | 1. Click delete 2. Confirm | — | Supplier removed. Toast: "Supplier deleted successfully". | Critical | — |
| SUP-06 | Delete supplier linked to products | Supplier has associated products | 1. Click delete on supplier with products | — | Foreign key constraint error or products' supplier_id set to null. | Critical | — |
| SUP-07 | Search suppliers | Multiple suppliers exist | 1. Type in search bar | search: "Tech" | Only suppliers matching "Tech" in company name or contact person displayed. | High | — |
| SUP-08 | Supplier list with no suppliers | No suppliers in database | 1. Navigate to /suppliers | "No suppliers found" message displayed. | Medium | — |

---

## 12. Test Cases — Sales Processing

The Sales module is a core component of the POS system. It supports two payment methods: Cash (immediate recording) and Paystack (digital payment with redirect and verification). Each sale generates a unique invoice number, records the clerk who processed it, and automatically deducts sold quantities from product inventory.

### 12.1 Cash Sale Flow

| ID | Test Case | Preconditions | Steps | Test Data | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|---|
| SALE-01 | Create cash sale with single item | Products with stock > 0 exist | 1. Click "New Sale" 2. Select a product 3. Enter quantity 4. Select "Cash" payment 5. Submit | Product: "Laptop Stand", Qty: 2 | Sale created with unique invoice_no. Total = qty × selling_price. Stock reduced by 2. Toast: "Sale created successfully". Sale appears in Recent Sales table. | Critical | — |
| SALE-02 | Create cash sale with multiple items | Multiple products exist | 1. Click "New Sale" 2. Add Product A (qty: 3) 3. Add Product B (qty: 1) 4. Select Cash 5. Submit | Products A & B with quantities | Sale created. sales_items table has 2 records. Total = sum of all subtotals. Both product quantities reduced. | Critical | — |
| SALE-03 | Quantity exceeds available stock | Product has quantity = 5 | 1. New Sale 2. Select product 3. Enter quantity = 10 4. Submit | Qty: 10 (stock: 5) | Error or warning displayed. Sale should not proceed if quantity exceeds stock. | Critical | — |
| SALE-04 | Submit sale with empty cart | No products added | 1. Click "New Sale" 2. Don't add any products 3. Try to submit | — | Validation prevents submission. User prompted to add at least one item. | High | — |
| SALE-05 | Submit sale with zero quantity | Product added | 1. New Sale 2. Select product 3. Enter quantity = 0 4. Submit | Qty: 0 | Validation prevents sale. Quantity must be at least 1. | High | — |
| SALE-06 | Remove item from cart before submitting | Cart has items | 1. Add products to cart 2. Remove one item 3. Submit | — | Only remaining items processed. Total recalculated. Removed item's stock unchanged. | Medium | — |

### 12.2 Paystack Payment Flow

| ID | Test Case | Preconditions | Steps | Test Data | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|---|
| SALE-07 | Initiate Paystack payment | Products in cart, Paystack selected | 1. Add products 2. Select "Paystack" 3. Submit | Valid cart data | Sale data stored in sessionStorage as "pendingSale". User redirected to Paystack payment page via edge function. | Critical | — |
| SALE-08 | Paystack payment success callback | Payment completed on Paystack | 1. Complete payment on Paystack 2. Redirected back to app with ?reference=xxx | Valid reference | usePaystackVerification hook detects reference. Calls paystack-verify edge function. On success: sale created, stock deducted, toast shown, reference params cleared. | Critical | — |
| SALE-09 | Paystack payment failed/cancelled | User cancels payment on Paystack | 1. Cancel payment on Paystack 2. Redirected back | Failed/cancelled reference | Verification returns non-success status. Toast: "Payment was not successful." sessionStorage cleared. No sale created. Stock unchanged. | Critical | — |
| SALE-10 | Paystack amount mismatch | Backend returns different amount | 1. Tamper with amount (security test) | Mismatched amounts | Toast: "Payment amount mismatch." Sale not created. sessionStorage cleared. | Critical | — |
| SALE-11 | Paystack verification loading state | Verification in progress | 1. Return from Paystack with reference | — | Loading banner displayed: "Verifying payment and completing sale..." with spinner. UI not interactive for sale creation during verification. | High | — |
| SALE-12 | Duplicate payment reference | Same reference processed twice | 1. Return from Paystack 2. Refresh page | Same reference | Sale should only be created once. Duplicate processing prevented. | High | — |

### 12.3 Sale Records & Details

| ID | Test Case | Preconditions | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| SALE-13 | View recent sales list | Sales exist | 1. Navigate to /sales | Table shows: Invoice No., Date, Items count, Total Amount, Payment Method (with color-coded badge), Clerk name, Actions. Sorted by most recent first. | Critical | — |
| SALE-14 | View sale details | Sale exists | 1. Click "View" button on a sale row | Sale details dialog opens showing: invoice number, date, items with quantities and prices, total amount, payment method, clerk information. | High | — |
| SALE-15 | Print sale details | Sale exists | 1. Click "Print" button on a sale row | Print-formatted view of the sale opens. Browser print dialog triggered or printable view displayed. | Medium | — |
| SALE-16 | Invoice number uniqueness | Multiple sales created | 1. Create several sales 2. Check invoice numbers | Each sale has a unique invoice_no. No duplicates in the database. | Critical | — |
| SALE-17 | Payment method badge colors | Sales with different payment methods exist | 1. View sales list | Cash: green badge (bg-success). Paystack: blue/primary badge (bg-primary). Mobile Money: yellow badge (bg-warning). | Low | — |
| SALE-18 | Sales quick stats cards | Sales exist | 1. Navigate to /sales | Three stat cards displayed: Today's Sales (count), Today's Revenue (KES formatted), Average Transaction. | Medium | — |

### 12.4 Stock Deduction Verification

| ID | Test Case | Preconditions | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| SALE-19 | Single item stock deduction | Product "X" has qty = 50 | 1. Create sale with Product X, qty = 5 2. Check product after sale | Product X quantity = 45. Inventory accurately reduced. | Critical | — |
| SALE-20 | Multi-item stock deduction | Products A(30), B(20), C(15) | 1. Create sale: A(3), B(5), C(2) 2. Check all products | A = 27, B = 15, C = 13. All quantities accurately reduced. | Critical | — |
| SALE-21 | Stock reaches zero after sale | Product has qty = 3 | 1. Create sale with qty = 3 | Product quantity = 0. Low stock indicator shown. Product still visible in list. | High | — |
| SALE-22 | Stock deduction with Paystack sale | Product has qty = 10 | 1. Complete Paystack sale for qty = 4 2. Verify after callback | Stock deducted only after successful payment verification, not at initiation. Product qty = 6. | Critical | — |

---

## 13. Test Cases — Dashboard & Analytics

The Dashboard provides a high-level overview of business performance including KPI cards, sales trend charts, and low-stock alerts. All authenticated users can access the dashboard.

| ID | Test Case | Preconditions | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| DASH-01 | KPI cards display correct data | Products and sales exist | 1. Navigate to /dashboard | Four KPI cards shown: Total Products (exact count from products table), Total Sales (exact count from sales table), Total Revenue (sum of all sale total_amounts), Total Profit (calculated from selling_price - cost_price). | Critical | — |
| DASH-02 | KPI cards loading state | — | 1. Navigate to /dashboard 2. Observe during data fetch | Skeleton loaders shown for each KPI card until data loads. No "0" or "NaN" values flash. | Medium | — |
| DASH-03 | Sales trend chart renders | Sales data exists | 1. Navigate to /dashboard 2. Scroll to chart section | Line/bar chart rendered using Recharts. Monthly data plotted correctly. Axes labeled. Tooltips functional on hover. | High | — |
| DASH-04 | Sales trend with no data | No sales in database | 1. Navigate to /dashboard | Chart section shows empty state or flat line. No JavaScript errors. | Medium | — |
| DASH-05 | Low stock alerts display | Products with qty ≤ reorder_level exist | 1. Navigate to /dashboard 2. View low stock section | Low stock items listed showing product name, current quantity, and reorder level. Limited to top 5 items sorted by lowest quantity. | High | — |
| DASH-06 | Low stock alerts with no low stock | All products have qty > reorder_level | 1. Navigate to /dashboard | Low stock section shows empty state or "No low stock items" message. | Medium | — |
| DASH-07 | Dashboard updates after new sale | On dashboard | 1. Open dashboard (note KPIs) 2. Create a new sale 3. Return to dashboard | KPI values updated to reflect the new sale: Total Sales +1, Total Revenue increased. TanStack Query invalidates and refetches. | High | — |
| DASH-08 | Dashboard updates after product change | On dashboard | 1. Note total products 2. Add a new product 3. Return to dashboard | Total Products count increased by 1. | Medium | — |

---

## 14. Test Cases — Reports Module

The Reports module provides detailed sales reporting with date range filtering. Access is restricted to Admin and Manager roles.

| ID | Test Case | Preconditions | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| REP-01 | View sales report | Logged in as admin/manager, sales exist | 1. Navigate to /reports | Sales data displayed in a table format with relevant columns. | Critical | — |
| REP-02 | Filter by date range | Sales across multiple dates | 1. Navigate to /reports 2. Select start date 3. Select end date 4. Apply filter | Only sales within the selected date range displayed. Count and totals match filtered data. | Critical | — |
| REP-03 | Date range — no matching sales | No sales in selected range | 1. Select a date range with no sales | Empty state or "No sales found for this period" message. No errors. | Medium | — |
| REP-04 | Date range — invalid range | — | 1. Select end date before start date | Validation prevents invalid range or results are empty with a helpful message. | Medium | — |
| REP-05 | Report data accuracy | Known sales data | 1. Create specific sales 2. Filter reports to verify | Report totals match the sum of individual sale amounts. Item counts are accurate. | Critical | — |
| REP-06 | Cashier access denied | Logged in as cashier | 1. Navigate to /reports | "Access Denied" screen displayed. No report data visible. | Critical | — |

---

## 15. Test Cases — User Management

User Management is an admin-only module that allows creating new system users, changing their roles, and deleting users. User creation and deletion are handled by edge functions (`create-user` and `delete-user`) for security.

| ID | Test Case | Preconditions | Steps | Test Data | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|---|
| USER-01 | Create new user | Logged in as admin | 1. Navigate to /users 2. Click "Add User" 3. Fill email, name, password, role 4. Submit | email: "new@test.com", name: "New User", role: "cashier" | User created via edge function. Appears in user list with assigned role and "Active" badge. Profile record created. | Critical | — |
| USER-02 | Create user with existing email | Email already registered | 1. Click "Add User" 2. Enter existing email 3. Submit | email: "admin@gizmoke.com" | Error displayed. Duplicate user not created. | Critical | — |
| USER-03 | Edit user role | User exists with role "cashier" | 1. Find user in list 2. Change role dropdown to "manager" | Role updated. Toast: "User role updated successfully". Old role deleted, new role inserted in user_roles table. | Critical | — |
| USER-04 | Delete user | Non-admin user exists | 1. Click delete on user 2. Confirm deletion | User removed from list. Auth account and profile deleted via edge function. Toast: "User deleted". | Critical | — |
| USER-05 | Cancel user deletion | Delete dialog open | 1. Click delete 2. Click "Cancel" | User remains in list. No deletion performed. | Medium | — |
| USER-06 | User list displays correctly | Multiple users exist | 1. Navigate to /users | Table shows: Username (full_name), Email, Role (with dropdown), Status (Active badge), Last Login (formatted date), Actions (delete button). | High | — |
| USER-07 | User list loading state | — | 1. Navigate to /users | Skeleton loaders in table rows during data fetch. | Medium | — |
| USER-08 | User list empty state | No users (unlikely) | 1. Navigate to /users | "No users found" message. | Low | — |
| USER-09 | Non-admin access to /users | Logged in as manager | 1. Navigate to /users | "Access Denied" screen. No user data visible. | Critical | — |

---

## 16. Test Cases — Settings & Profile Management

Settings is restricted to Admin users only. It provides system configuration and profile management capabilities.

| ID | Test Case | Preconditions | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| SET-01 | Access settings as admin | Logged in as admin | 1. Navigate to /settings | Settings page renders with profile and configuration options. | Critical | — |
| SET-02 | Access settings as manager | Logged in as manager | 1. Navigate to /settings | "Access Denied" screen. | Critical | — |
| SET-03 | Access settings as cashier | Logged in as cashier | 1. Navigate to /settings | "Access Denied" screen. | Critical | — |
| SET-04 | Update profile information | Admin on settings page | 1. Edit full name or phone 2. Save | Profile updated. Toast success. Changes reflected on next load. | High | — |
| SET-05 | Update profile with invalid data | Admin on settings page | 1. Clear required fields 2. Save | Validation prevents save. Error indicators shown. | Medium | — |

---

## 17. Database & Data Integrity Testing

These tests verify that data remains consistent across related tables and that database constraints are properly enforced.

| ID | Test Case | Description | Expected Result | Priority | Status |
|---|---|---|---|---|---|
| DB-01 | Foreign key — products to categories | Delete a category referenced by products | Either cascade or prevent deletion. No orphaned product records. | Critical | — |
| DB-02 | Foreign key — products to suppliers | Delete a supplier referenced by products | Either cascade or prevent deletion. No orphaned records. | Critical | — |
| DB-03 | Foreign key — sales_items to sales | Verify sale items are linked to existing sales | sales_items.sale_id always references valid sales.id. | Critical | — |
| DB-04 | Foreign key — sales_items to products | Verify product references in sale items | sales_items.product_id always references valid products.id. | Critical | — |
| DB-05 | UUID generation | Create new records across all tables | All IDs are valid UUIDs generated by gen_random_uuid(). No duplicates. | High | — |
| DB-06 | Timestamp defaults | Create new records | created_at automatically set to current timestamp. updated_at set for products, suppliers, profiles. | High | — |
| DB-07 | Concurrent stock update | Two users sell same product simultaneously | Final stock = initial - (sale1_qty + sale2_qty). No race condition causing incorrect count. | Critical | — |
| DB-08 | Data type validation | Insert invalid data types | Database rejects: text in numeric fields, invalid UUIDs, malformed timestamps. | High | — |
| DB-09 | SKU uniqueness constraint | Insert two products with same SKU | Second insert fails with unique constraint violation error. | Critical | — |
| DB-10 | Null handling | Insert records with null optional fields | Null values accepted for: products.description, products.category_id, products.supplier_id, categories.description, suppliers.address, suppliers.products_supplied, profiles.phone. | Medium | — |

---

## 18. Security Testing

Security is critical for a POS system handling financial transactions. This section covers Row Level Security (RLS) policies, authentication enforcement, and input sanitization.

### 18.1 Row Level Security (RLS) Testing

| ID | Test Case | Description | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| SEC-01 | RLS — profiles read own | User can only read their own profile | 1. Authenticate as User A 2. Query profiles table 3. Check returned rows | Only User A's profile returned. No other users' data visible. | Critical | — |
| SEC-02 | RLS — profiles update own | User can only update their own profile | 1. Authenticate as User A 2. Attempt to update User B's profile via API | Update fails. User B's data unchanged. | Critical | — |
| SEC-03 | RLS — products authenticated access | Only authenticated users can read products | 1. Make unauthenticated request to products 2. Make authenticated request | Unauthenticated: 401 or empty result. Authenticated: full product list returned. | Critical | — |
| SEC-04 | RLS — sales data scoping | Sales data properly scoped | 1. Query sales as authenticated user | Results returned based on RLS policy. No unauthorized data leakage. | Critical | — |
| SEC-05 | RLS — user_roles protection | Non-admin cannot modify user roles | 1. Authenticate as cashier 2. Attempt to insert/update user_roles | Operation denied by RLS policy. | Critical | — |
| SEC-06 | RLS — unauthenticated table access | All tables reject unauthenticated access | 1. Make unauthenticated requests to each table | All requests return 401 or empty results. No data exposed. | Critical | — |

### 18.2 Authentication Security

| ID | Test Case | Description | Expected Result | Priority | Status |
|---|---|---|---|---|---|
| SEC-07 | Password not stored in plaintext | Verify password hashing | Passwords stored as bcrypt hashes in auth.users, never in plaintext. | Critical | — |
| SEC-08 | Session token security | Verify token storage | JWT tokens stored securely. Tokens expire and are refreshed appropriately. | Critical | — |
| SEC-09 | CORS policy enforcement | Cross-origin requests | Only allowed origins can make API requests. Unknown origins rejected. | High | — |
| SEC-10 | Rate limiting on login | Brute force prevention | After multiple failed attempts, requests are throttled or blocked. | High | — |

### 18.3 Input Sanitization

| ID | Test Case | Test Input | Expected Result | Priority | Status |
|---|---|---|---|---|---|
| SEC-11 | SQL injection via product name | name: `'; DROP TABLE products; --` | Input treated as string. No SQL execution. Product created with literal string name. | Critical | — |
| SEC-12 | SQL injection via search | search: `" OR 1=1 --` | Search treats input as literal text. No unauthorized data returned. | Critical | — |
| SEC-13 | XSS via product description | desc: `<script>alert('xss')</script>` | Script not executed. HTML rendered as escaped text. | Critical | — |
| SEC-14 | XSS via supplier name | company: `<img onerror="alert(1)" src="x">` | Image tag not rendered. Text displayed as-is. | Critical | — |
| SEC-15 | Large input handling | name: 10,000 character string | Either truncated or rejected. No buffer overflow or UI breakage. | Medium | — |

### 18.4 Edge Function Security

| ID | Test Case | Description | Expected Result | Priority | Status |
|---|---|---|---|---|---|
| SEC-16 | create-user without auth | Call create-user edge function without auth token | Request rejected with 401 Unauthorized. | Critical | — |
| SEC-17 | delete-user without auth | Call delete-user edge function without auth token | Request rejected with 401 Unauthorized. | Critical | — |
| SEC-18 | create-user as non-admin | Call create-user as cashier/manager | Request rejected. Only admin role permitted. | Critical | — |
| SEC-19 | paystack-verify with invalid reference | Call paystack-verify with fake reference | Returns error or non-success status. No sale created. | Critical | — |
| SEC-20 | paystack-initialize with tampered amount | Call with negative or zero amount | Edge function validates and rejects invalid amounts. | High | — |

---

## 19. API & Edge Function Testing

The system uses four edge functions for backend operations. Each must be tested independently.

### 19.1 create-user Edge Function

| ID | Test Case | Request Body | Expected Response | Priority | Status |
|---|---|---|---|---|---|
| API-01 | Create user with valid data | `{"email": "test@test.com", "password": "Test123!", "fullName": "Test User", "role": "cashier"}` | 200 OK. User created in auth.users. Profile created. Role assigned. | Critical | — |
| API-02 | Create user with missing fields | `{"email": "test@test.com"}` | 400 Bad Request with descriptive error message. | High | — |
| API-03 | Create user with invalid email | `{"email": "notanemail", ...}` | 400 Bad Request. Email validation error. | High | — |

### 19.2 delete-user Edge Function

| ID | Test Case | Request Body | Expected Response | Priority | Status |
|---|---|---|---|---|---|
| API-04 | Delete existing user | `{"userId": "valid-uuid"}` | 200 OK. User removed from auth.users. Profile deleted. Roles deleted. | Critical | — |
| API-05 | Delete non-existent user | `{"userId": "non-existent-uuid"}` | 404 or error response. No crash. | High | — |
| API-06 | Delete without userId | `{}` | 400 Bad Request. | High | — |

### 19.3 paystack-initialize Edge Function

| ID | Test Case | Request Body | Expected Response | Priority | Status |
|---|---|---|---|---|---|
| API-07 | Initialize with valid data | `{"email": "user@test.com", "amount": 5000, "reference": "INV-001", "callbackUrl": "https://..."}` | 200 OK with Paystack authorization_url. | Critical | — |
| API-08 | Initialize with zero amount | `{"email": "user@test.com", "amount": 0, ...}` | Error response. Payment not initialized. | High | — |

### 19.4 paystack-verify Edge Function

| ID | Test Case | Request Body | Expected Response | Priority | Status |
|---|---|---|---|---|---|
| API-09 | Verify successful payment | `{"reference": "valid-paid-reference"}` | 200 OK with `{status: "success", amount: <paid_amount>}`. | Critical | — |
| API-10 | Verify failed payment | `{"reference": "failed-reference"}` | 200 OK with `{status: "failed", ...}`. | Critical | — |
| API-11 | Verify with invalid reference | `{"reference": "invalid-ref-12345"}` | Error response from Paystack API forwarded. | High | — |

---

## 20. UI/UX & Usability Testing

These tests ensure the user interface is intuitive, consistent, and follows the design system.

| ID | Test Case | Description | Expected Result | Priority | Status |
|---|---|---|---|---|---|
| UI-01 | Consistent page header format | All pages follow same layout | Each page has: h1 title, subtitle description, action button (where applicable). Consistent spacing. | High | — |
| UI-02 | Table loading skeletons | All data tables | Skeleton rows displayed during data fetch. Matches table column widths. | Medium | — |
| UI-03 | Empty state messages | All data tables when empty | "No [items] found" message centered in table. No blank rows. | Medium | — |
| UI-04 | Toast notifications | All CRUD operations | Success: green toast. Error: red/destructive toast. Messages are descriptive and user-friendly. | High | — |
| UI-05 | Dialog open/close behavior | All dialogs (Add, Edit, Delete) | Dialogs open with animation. Close on X, outside click, or Cancel. Form state resets on close. | High | — |
| UI-06 | Form validation indicators | All forms | Required fields marked. Invalid fields highlighted with red border. Error messages shown below fields. | High | — |
| UI-07 | Navigation active state | Sidebar navigation | Current page link visually highlighted. Other links in default state. | Medium | — |
| UI-08 | Dark mode / Light mode | Theme switching (if implemented) | All components render correctly in both themes. No contrast issues. All semantic tokens resolve correctly. | Medium | — |
| UI-09 | Button loading states | Submit buttons during API calls | Button shows loading spinner and/or text change ("Saving...", "Deleting..."). Button disabled during operation. | High | — |
| UI-10 | Currency formatting | All monetary displays | Amounts displayed as "KES X,XXX" with proper thousand separators. No decimal inconsistencies. | Medium | — |
| UI-11 | Date formatting | All date displays | Dates formatted consistently as "MMM dd, yyyy" (e.g., "Feb 22, 2026") using date-fns. | Medium | — |

---

## 21. Mobile Responsiveness Testing

The application must be fully functional on mobile devices with screen widths as small as 320px.

| ID | Test Case | Viewport | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| MOB-01 | Navigation on mobile | 375 × 812 | 1. Open app 2. Tap hamburger menu 3. Navigate between pages | Hamburger menu toggles sidebar. All links accessible and functional. Sidebar closes after navigation. | Critical | — |
| MOB-02 | Product table on mobile | 375 × 812 | 1. Navigate to /products 2. Scroll table | Table scrolls horizontally within its container. All columns accessible. No content cut off. | High | — |
| MOB-03 | Add Product dialog on mobile | 375 × 812 | 1. Open Add Product dialog 2. Fill all fields 3. Submit | Dialog is scrollable. All form fields visible and usable. Virtual keyboard doesn't obscure active input. | High | — |
| MOB-04 | Add Sale dialog on mobile | 375 × 812 | 1. Open New Sale dialog 2. Select products 3. Submit | Product selection dropdown works. Quantity inputs accessible. Total calculated and visible. Submit button reachable. | High | — |
| MOB-05 | Dashboard on mobile | 375 × 812 | 1. Navigate to /dashboard | KPI cards stack vertically (single column). Chart adapts to screen width. Low stock section scrollable. | High | — |
| MOB-06 | Sales table on mobile | 375 × 812 | 1. Navigate to /sales | Table scrolls horizontally. Action buttons (view/print) accessible. | High | — |
| MOB-07 | Login page on mobile | 320 × 568 | 1. Open /auth | Card centered. Form fields full-width. Login button accessible without scrolling. | High | — |
| MOB-08 | Page headers on mobile | 375 × 812 | 1. Navigate to any page | Title and action button stack vertically (flex-col). No horizontal overflow. | Medium | — |
| MOB-09 | Delete confirmation on mobile | 375 × 812 | 1. Trigger delete action | Confirmation dialog fully visible. Buttons accessible. Text readable. | Medium | — |
| MOB-10 | Touch targets | 375 × 812 | 1. Test all interactive elements | All buttons, links, and inputs have minimum 44×44px touch target. Easy to tap without accidental taps. | Medium | — |

---

## 22. Performance Testing

Performance tests ensure the application remains responsive under normal operating conditions.

| ID | Test Case | Measurement | Target | Method | Priority | Status |
|---|---|---|---|---|---|---|
| PERF-01 | Initial page load (auth) | Time to Interactive (TTI) | < 3 seconds on 4G | Lighthouse / DevTools | High | — |
| PERF-02 | Dashboard load time | Time from navigation to all KPIs rendered | < 3 seconds | DevTools Performance tab | High | — |
| PERF-03 | Product list render (50 items) | Time to render complete table | < 2 seconds | DevTools | Medium | — |
| PERF-04 | Product list render (200+ items) | Time to render complete table | < 5 seconds | DevTools | Medium | — |
| PERF-05 | Sale creation response | Time from submit to success toast | < 2 seconds | Stopwatch / DevTools | High | — |
| PERF-06 | Paystack redirect time | Time from submit to Paystack page | < 3 seconds | Stopwatch | Medium | — |
| PERF-07 | Search filtering latency | Time from keystroke to filtered results | < 500ms | Perceived responsiveness | Medium | — |
| PERF-08 | Dialog open animation | Time from click to dialog visible | < 300ms | Perceived responsiveness | Low | — |
| PERF-09 | Navigation between pages | Time from click to new page rendered | < 1 second (client-side routing) | DevTools | Medium | — |
| PERF-10 | Memory usage | JS heap size after 30 min usage | < 100MB | Chrome Task Manager | Low | — |
| PERF-11 | Bundle size | Total JavaScript bundle | < 500KB gzipped | Vite build output | Medium | — |
| PERF-12 | Largest Contentful Paint (LCP) | Dashboard page | < 2.5 seconds | Lighthouse | High | — |
| PERF-13 | Cumulative Layout Shift (CLS) | All pages | < 0.1 | Lighthouse | Medium | — |

---

## 23. Integration Testing

Integration tests verify that different modules work together correctly and data flows properly between them.

| ID | Test Case | Modules Involved | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| INT-01 | Product → Sale → Stock | Products, Sales | 1. Note product stock 2. Create sale 3. Verify product stock | Stock accurately reduced. Sale total correct. Dashboard KPIs updated. | Critical | — |
| INT-02 | Category → Product listing | Categories, Products | 1. Create category 2. Assign to product 3. Filter products by category | Product appears under correct category filter. Category name displayed in product table. | High | — |
| INT-03 | Supplier → Product association | Suppliers, Products | 1. Create supplier 2. Assign to product 3. View product details | Supplier name shown in product listing. | High | — |
| INT-04 | User creation → Login → Role access | Users, Auth, RBAC | 1. Admin creates user (cashier) 2. New user logs in 3. User navigates restricted route | User can login. Role-restricted routes show "Access Denied". Allowed routes work normally. | Critical | — |
| INT-05 | Sale → Dashboard KPIs | Sales, Dashboard | 1. Note dashboard KPIs 2. Create sale 3. Check dashboard | Total Sales +1, Revenue increased, chart updated on next refresh. | High | — |
| INT-06 | Product → Dashboard low stock | Products, Dashboard | 1. Reduce product qty below reorder level 2. Check dashboard | Product appears in low stock alerts. | High | — |
| INT-07 | Sale → Reports | Sales, Reports | 1. Create sale 2. Navigate to reports 3. Filter to include sale date | New sale appears in report with correct details. | High | — |
| INT-08 | Paystack → Sale → Stock → Dashboard | Paystack, Sales, Products, Dashboard | 1. Create Paystack sale 2. Complete payment 3. Verify sale, stock, dashboard | Full end-to-end: Payment verified → Sale recorded → Stock deducted → Dashboard updated. | Critical | — |
| INT-09 | Role change → Access update | Users, RBAC | 1. Change user from cashier to manager 2. User refreshes 3. Navigate to /reports | Reports page now accessible (was previously denied). | High | — |
| INT-10 | User deletion → Data cleanup | Users, Profiles, Roles | 1. Admin deletes user 2. Check profiles table 3. Check user_roles table | Profile removed. Role entry removed. No orphaned records. | Critical | — |

---

## 24. Regression Testing

Regression tests are a subset of critical test cases that must pass after any code change, bug fix, or deployment.

### 24.1 Regression Test Suite

| Priority | Test IDs | Module | Description |
|---|---|---|---|
| P1 — Must Pass | AUTH-01, AUTH-12, AUTH-15 | Authentication | Login, logout, protected route |
| P1 — Must Pass | RBAC-01, RBAC-05, RBAC-09 | RBAC | Admin access, manager restriction, cashier restriction |
| P1 — Must Pass | PROD-01, PROD-15, PROD-20 | Products | Create, edit, delete product |
| P1 — Must Pass | SALE-01, SALE-08, SALE-19 | Sales | Cash sale, Paystack verification, stock deduction |
| P1 — Must Pass | SEC-01, SEC-03, SEC-11 | Security | RLS, auth enforcement, SQL injection |
| P2 — Should Pass | DASH-01, DASH-05, REP-01, REP-02 | Dashboard/Reports | KPIs, low stock, report filtering |
| P2 — Should Pass | USER-01, USER-03, USER-04 | User Management | Create, edit role, delete user |
| P2 — Should Pass | CAT-01, SUP-01 | Categories/Suppliers | Basic CRUD |
| P3 — Nice to Pass | MOB-01, MOB-03, MOB-04 | Mobile | Navigation, forms on mobile |
| P3 — Nice to Pass | PERF-01, PERF-02, PERF-05 | Performance | Load times |

---

## 25. Error Handling & Edge Cases

| ID | Test Case | Scenario | Expected Result | Priority | Status |
|---|---|---|---|---|---|
| ERR-01 | Network failure during login | Disconnect internet during login | Error toast: "Network error" or similar. App doesn't crash. | High | — |
| ERR-02 | Network failure during sale creation | Disconnect during sale submit | Error toast displayed. Sale not partially created. Stock not incorrectly deducted. Data consistent. | Critical | — |
| ERR-03 | Backend timeout | Backend takes > 30 seconds | Request times out gracefully. User can retry. No duplicate records. | High | — |
| ERR-04 | Concurrent edits | Two admins edit same product simultaneously | Last write wins. No data corruption. Both users see updated data on refresh. | Medium | — |
| ERR-05 | Browser back button after form submit | Submit form, press back | No duplicate submission. Data consistent. | Medium | — |
| ERR-06 | Rapid form submissions | Double-click submit button quickly | Only one record created. Button disabled during processing prevents duplicates. | High | — |
| ERR-07 | Special characters in all text fields | Enter: `!@#$%^&*(){}[]|<>?/\` | Characters stored and displayed correctly. No rendering issues or errors. | Medium | — |
| ERR-08 | Unicode characters | Enter: Arabic, Chinese, emoji characters | Characters stored and displayed correctly. UTF-8 encoding works. | Low | — |
| ERR-09 | Very long product name | Enter 500+ character name | Either truncated at UI level or stored fully. No overflow or layout break. | Low | — |
| ERR-10 | Maximum numeric values | Enter price: 999,999,999.99 | Value stored correctly. Displayed with proper formatting. No integer overflow. | Medium | — |

---

## 26. Test Data Requirements

### 26.1 Minimum Test Data Set

| Entity | Quantity | Description |
|---|---|---|
| Admin users | 1 | Full system access |
| Manager users | 2 | Department-level access |
| Cashier users | 3 | Sales and product access only |
| Categories | 5 | Electronics, Furniture, Accessories, Clothing, Food & Beverage |
| Suppliers | 4 | Various suppliers with complete contact info |
| Products | 20 | Mix of: products in each category, various stock levels (including low stock and zero stock), different price ranges |
| Products at reorder level | 3 | For low stock alert testing |
| Products with zero stock | 2 | For out-of-stock testing |
| Cash sales | 10 | Various amounts, dates, and clerks |
| Paystack sales | 5 | Various amounts, successful and failed |
| Sales with multiple items | 5 | 2-5 items per sale |

### 26.2 Test Data Cleanup

After each test execution cycle, the following cleanup should be performed:

| Action | Tables Affected | Method |
|---|---|---|
| Remove test sales | sales, sales_items | DELETE WHERE invoice_no LIKE 'TEST-%' |
| Reset product quantities | products | UPDATE to original test values |
| Remove test users | auth.users, profiles, user_roles | Via delete-user edge function |
| Remove test categories | categories | DELETE WHERE name LIKE 'Test%' |
| Remove test suppliers | suppliers | DELETE WHERE company_name LIKE 'Test%' |

---

## 27. Defect Management

### 27.1 Defect Lifecycle

| Stage | Description | Responsible |
|---|---|---|
| **New** | Defect discovered and logged with severity, steps to reproduce, screenshots | QA Engineer |
| **Assigned** | Defect reviewed and assigned to developer | QA Lead |
| **In Progress** | Developer investigating and fixing | Developer |
| **Fixed** | Fix implemented and deployed to test environment | Developer |
| **Verified** | QA confirms fix resolves the issue without introducing new defects | QA Engineer |
| **Closed** | Defect fully resolved | QA Lead |
| **Reopened** | Fix did not resolve the issue or caused regression | QA Engineer |

### 27.2 Defect Report Template

| Field | Description |
|---|---|
| Defect ID | Auto-generated unique identifier |
| Title | Brief, descriptive title of the issue |
| Severity | S1 (Critical) / S2 (High) / S3 (Medium) / S4 (Low) |
| Module | Authentication, Products, Sales, etc. |
| Steps to Reproduce | Numbered steps to recreate the defect |
| Expected Result | What should happen |
| Actual Result | What actually happens |
| Screenshots/Video | Visual evidence of the defect |
| Environment | Browser, OS, viewport, test account used |
| Assignee | Developer responsible for the fix |
| Status | New / Assigned / In Progress / Fixed / Verified / Closed / Reopened |

---

## 28. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Paystack API downtime during testing | Medium | High | Use Paystack test mode. Have mock responses ready. Document as known dependency. |
| Concurrent stock update race condition | Medium | Critical | Implement database-level locking or optimistic concurrency. Add specific test case (DB-07). |
| Session token expiration mid-workflow | Low | High | Test with short-lived tokens. Implement token refresh. Handle gracefully in UI. |
| RLS policy misconfiguration | Low | Critical | Run security scan tool regularly. Test each policy independently. |
| Edge function deployment failure | Low | High | Test edge functions independently before integration. Monitor deployment logs. |
| Browser compatibility issues | Medium | Medium | Focus on Chrome first. Test other browsers in P2 cycle. Use CSS feature queries. |
| Mobile layout breakage | Medium | Medium | Test responsive breakpoints systematically. Use browser DevTools device emulation. |
| Data migration issues between environments | Low | High | Test migration scripts separately. Always backup before migration. |

---

## 29. Entry & Exit Criteria

### 29.1 Entry Criteria

The following conditions must be met before test execution begins:

| Criteria | Description | Verification |
|---|---|---|
| Code deployment complete | Latest code deployed to test environment | Build success confirmed |
| Test environment stable | Backend operational, database accessible | Health check passed |
| Test data seeded | Minimum test data set created | Data verification query |
| Test accounts active | Admin, Manager, Cashier accounts created and verified | Login test passed |
| Edge functions deployed | All 4 edge functions deployed and accessible | Edge function health check |
| Paystack test mode configured | Paystack API keys configured in test mode | Test initialization call succeeds |

### 29.2 Exit Criteria

Testing is considered complete when:

| Criteria | Threshold | Measurement |
|---|---|---|
| All Critical (P1) tests executed | 100% | Test execution log |
| All Critical tests passed | 100% | Test results |
| All High priority tests executed | 100% | Test execution log |
| High priority test pass rate | ≥ 95% | Test results |
| Medium priority test pass rate | ≥ 90% | Test results |
| No open S1 (Critical) defects | 0 | Defect tracker |
| No open S2 (High) defects | ≤ 2 (with approved workarounds) | Defect tracker |
| Security tests all passed | 100% | Security test results |
| Regression suite passed | 100% | Regression results |

---

## 30. Test Schedule

| Phase | Duration | Activities | Deliverables |
|---|---|---|---|
| **Phase 1: Preparation** | 2 days | Test environment setup, test data creation, test account provisioning | Environment ready confirmation |
| **Phase 2: Smoke Testing** | 1 day | Basic login, navigation, page load verification | Smoke test report |
| **Phase 3: Functional Testing** | 5 days | Execute all functional test cases (AUTH, RBAC, PROD, CAT, SUP, SALE, DASH, REP, USER, SET) | Functional test report |
| **Phase 4: Integration Testing** | 2 days | Execute all integration test cases (INT-01 through INT-10) | Integration test report |
| **Phase 5: Security Testing** | 2 days | Execute all security test cases (SEC-01 through SEC-20), run security scan | Security test report |
| **Phase 6: Performance & Mobile** | 2 days | Performance benchmarks, mobile responsiveness testing | Performance & mobile report |
| **Phase 7: Regression** | 1 day | Execute regression suite after all bug fixes | Regression test report |
| **Phase 8: UAT** | 2 days | Business stakeholder testing with real-world scenarios | UAT sign-off |
| **Total** | **17 days** | — | **Final test report** |

---

## 31. Approvals & Sign-Off

### 31.1 Document Approval

| Role | Name | Date | Signature |
|---|---|---|---|
| QA Lead | | | |
| Senior Developer | | | |
| Project Manager | | | |

### 31.2 Test Completion Sign-Off

| Role | Name | Date | Result | Signature |
|---|---|---|---|---|
| QA Lead | | | ☐ Pass ☐ Fail | |
| Project Manager | | | ☐ Pass ☐ Fail | |
| Business Stakeholder | | | ☐ Pass ☐ Fail | |
| DevOps Lead | | | ☐ Pass ☐ Fail | |

---

## Appendix A: Glossary

| Term | Definition |
|---|---|
| CRUD | Create, Read, Update, Delete — basic data operations |
| KPI | Key Performance Indicator — measurable metric for business performance |
| POS | Point of Sale — system for processing sales transactions |
| RBAC | Role-Based Access Control — permission system based on user roles |
| RLS | Row Level Security — database-level policy that restricts row access |
| SKU | Stock Keeping Unit — unique product identifier |
| TTI | Time to Interactive — performance metric measuring when page becomes usable |
| UAT | User Acceptance Testing — testing by business stakeholders |
| UUID | Universally Unique Identifier — 128-bit identifier for database records |
| JWT | JSON Web Token — compact token format for secure authentication |
| LCP | Largest Contentful Paint — Core Web Vital measuring loading performance |
| CLS | Cumulative Layout Shift — Core Web Vital measuring visual stability |

## Appendix B: Test Case Summary

| Module | Total Cases | Critical | High | Medium | Low |
|---|---|---|---|---|---|
| Authentication | 20 | 11 | 7 | 2 | 0 |
| RBAC | 17 | 12 | 4 | 1 | 0 |
| Products | 22 | 8 | 9 | 4 | 1 |
| Categories | 9 | 4 | 3 | 2 | 0 |
| Suppliers | 8 | 3 | 3 | 1 | 1 |
| Sales | 22 | 13 | 6 | 2 | 1 |
| Dashboard | 8 | 1 | 4 | 3 | 0 |
| Reports | 6 | 3 | 0 | 2 | 0 |
| User Management | 9 | 4 | 2 | 2 | 1 |
| Settings | 5 | 2 | 1 | 1 | 0 |
| Database Integrity | 10 | 5 | 3 | 2 | 0 |
| Security | 20 | 15 | 5 | 0 | 0 |
| API/Edge Functions | 11 | 5 | 6 | 0 | 0 |
| UI/UX | 11 | 0 | 6 | 5 | 0 |
| Mobile Responsive | 10 | 1 | 6 | 3 | 0 |
| Performance | 13 | 0 | 4 | 6 | 3 |
| Integration | 10 | 4 | 6 | 0 | 0 |
| Error Handling | 10 | 1 | 3 | 4 | 2 |
| **TOTAL** | **221** | **92** | **78** | **40** | **9** |

---

*End of Test Plan Document*  
*GizmoStock Sync POS — Version 2.0*  
*© 2026 GizmoKe. All rights reserved.*
