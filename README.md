# GizmoKe Inventory & Sales Management System

## 📌 Overview

GizmoKe is a cloud-based Inventory and Sales Management System designed to streamline operations for small and medium-sized retail businesses dealing in gadget accessories. The system automates inventory tracking, sales processing, reporting, and user management, providing real-time insights and improving operational efficiency.

---

## 🎯 Objectives

* Automate inventory and sales processes
* Provide real-time stock tracking
* Generate accurate sales and revenue reports
* Support role-based user access control
* Enable data-driven decision-making

---

## 🚀 Features

### 1. Inventory Management

* Add, update, and delete products
* Categorize products (e.g., chargers, audio devices)
* Track stock levels in real time
* Low-stock alerts

### 2. Sales Management

* Record sales transactions
* Automatically update inventory after each sale
* Generate receipts and transaction history

### 3. Reporting & Analytics

* Daily, weekly, and monthly sales reports
* Revenue trend analysis
* Exportable reports

### 4. User Management

* Role-based access (Admin, Staff)
* Secure authentication
* Profile management

### 5. Notifications

* Low stock alerts
* System notifications

### 6. Settings Management

* Configure business details (name, contact, currency)
* Set tax rates and receipt preferences

---

## 🏗️ System Architecture

```bash
Frontend (Web Application)
        ↓
Supabase API (Backend as a Service)
        ↓
PostgreSQL Database (Cloud Storage)
```

---

## 🛠️ Technologies Used

* **Frontend:** JavaScript / HTML / CSS
* **Backend:** Supabase (Backend-as-a-Service)
* **Database:** PostgreSQL (via Supabase)
* **Version Control:** GitHub

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/gizmoke.git
cd gizmoke
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Application

```bash
npm run dev
```

---

## 🗄️ Database Structure

The system uses the following core tables:

* products
* categories
* sales
* sales_items
* profiles
* user_roles
* suppliers
* notifications
* settings

---

## 🔐 Security Features

* Row Level Security (RLS) enabled in Supabase
* Role-based access control
* Secure authentication and authorization

---

## 📊 Key Functionalities

* Real-time data synchronization
* Automated revenue calculations
* Transaction tracking and audit trails
* Cloud-based access and storage

---

## 🧾 Tax & Compliance Support

GizmoKe supports tax compliance by:

* Recording all transactions digitally
* Enabling VAT calculations
* Supporting integration with payment providers
* Providing structured data for systems like eTIMS

---

## 📈 Future Enhancements

* Integration with payment gateways (e.g., Paystack)
* eTIMS API integration for automated tax submission
* Mobile application version
* Advanced analytics dashboard
* Multi-branch support

---

## 🧪 Testing

The system has been tested for:

* Functional correctness
* Database integrity
* User interface responsiveness
* Performance under normal usage conditions

---

## 📚 Documentation

Detailed system documentation includes:

* System Requirements Specification
* Design and Architecture
* Test Plan and Results
* User Manual

---

## 👨‍💻 Author

**Wayne Munge**
Software Development 

---

## 📄 License

This project is developed for commercial use with proper licensing.

---

## ⭐ Acknowledgements

* Supabase for backend services
* GitHub for version control


---
