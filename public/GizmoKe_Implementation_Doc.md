# SCHOOL OF TECHNOLOGY

# BACHELOR OF SOFTWARE DEVELOPMENT

# UNIT: BSD 3201

# FINAL YEAR PROJECT

# TITLE: GIZMOKE INVENTORY MANAGEMENT SYSTEM

---

# IMPLEMENTATION PLAN

## 1. INTRODUCTION

This implementation plan outlines how the GizmoKe Inventory Management System will be moved from development into actual use. The document covers the timeline of activities, how users will learn to use the system, how data will be handled during the switch, and how the application will be maintained after it goes live. GizmoKe is a web-based inventory management system designed for electronics retail businesses to manage products, track sales, handle suppliers, and generate business reports. The goal is to ensure a smooth transition from any existing manual or legacy inventory methods to the new digital platform without any major disruptions to daily business operations.

---

## 2. IMPLEMENTATION SCHEDULE

| Activity | Start Date | End Date | Duration | Responsible Person |
|---|---|---|---|---|
| Final code review and cleanup | March 16, 2026 | March 18, 2026 | 3 days | Developer |
| Database migration and seeding | March 19, 2026 | March 20, 2026 | 2 days | Developer |
| Setting up the production environment | March 21, 2026 | March 22, 2026 | 2 days | Developer / System Admin |
| User account creation and role assignment | March 23, 2026 | March 23, 2026 | 1 day | Administrator |
| Product and supplier data entry | March 23, 2026 | March 25, 2026 | 3 days | Admin / Manager |
| User training sessions | March 25, 2026 | March 27, 2026 | 3 days | Developer |
| Parallel run (old and new system) | March 28, 2026 | April 3, 2026 | 7 days | Developer and staff |
| Full system go-live | April 4, 2026 | - | - | All users |

---

## 3. INSTALLATION AND CONVERSION PLANS

### 3.1 Software and Hardware Installation Plans

Before the GizmoKe Inventory Management System can be used, all required software and hardware must be ready. Since this is a web-based application hosted in the cloud, the installation process is straightforward, but there are important requirements to verify.

#### Hardware Requirements

For users to access GizmoKe, they need:

- A computer, laptop, tablet, or smartphone with a modern web browser
- Minimum screen resolution of 1024×768 (desktop) or 375×667 (mobile)
- A stable internet connection (Wi-Fi or mobile data, minimum 1 Mbps)
- A printer connected to the device (for receipt and report printing)
- Sufficient device storage for downloading exported reports (at least 50MB free)

Most modern devices purchased within the last five years meet these requirements comfortably. The system is fully responsive and works on both desktop and mobile browsers.

#### Software Requirements

- A modern web browser: Google Chrome (v90+), Mozilla Firefox (v88+), Microsoft Edge (v90+), or Safari (v14+)
- JavaScript must be enabled in the browser
- PDF viewer for viewing exported reports
- No additional software installation is required as GizmoKe runs entirely in the browser

#### Server/Cloud Infrastructure

The production environment uses the following cloud stack:

- **Frontend Hosting**: Lovable Cloud (automatic deployment via Git)
- **Backend & Database**: Lovable Cloud (PostgreSQL database with Row-Level Security)
- **Authentication**: Built-in authentication system with role-based access control
- **Edge Functions**: Serverless functions for user management and payment processing

### 3.2 Activities of Conversion

Converting from manual inventory tracking (spreadsheets, paper records, or legacy software) to using GizmoKe involves several steps. This is not just about accessing a website; it is about changing how the entire business manages its inventory, sales, and supplier relationships.

#### Before Conversion (Current State)

Currently, businesses in our target group manage inventory in various ways:

- Recording stock levels in paper notebooks or ledgers
- Using spreadsheets (Excel/Google Sheets) to track products
- Manually writing receipts for customers
- Tracking supplier information in contact books or scattered files
- Generating reports by manually tallying figures at the end of each day/week/month

These methods have significant problems. Paper records can be lost or damaged. Spreadsheets are prone to human error and lack real-time updates. Manual receipts are time-consuming and unprofessional. There is no centralized view of the business's performance.

#### During Conversion (The Transition Period)

When GizmoKe becomes available, the following activities will happen:

1. **Awareness**: All staff members will be informed about the new system through meetings and demonstrations. They will learn what the system does and how it will improve daily operations.
2. **Account Setup**: The administrator will create user accounts for all staff members and assign appropriate roles (Admin, Manager, or Cashier).
3. **Data Migration**: Existing product data, supplier information, and category lists will be entered into the system. This can be done manually through the web interface or via bulk import.
4. **Installation Support**: For the first week after go-live, the developer will be available to help anyone who has trouble accessing or using the system. Support will be provided through phone calls, WhatsApp messages, or in-person assistance.
5. **Parallel Running**: For approximately seven days, staff will use both the old methods and GizmoKe simultaneously. This lets them compare results and build confidence in the new system.
6. **Feedback Collection**: Users will be encouraged to report any problems they encounter or suggest improvements. This feedback will be used to fix issues quickly.

#### After Conversion (The New Way)

Once staff have fully switched to GizmoKe, they will:

- Log into the system at the start of each shift
- Process all sales through the digital point-of-sale interface
- Receive automatic low-stock notifications when products need reordering
- View real-time dashboards showing business performance
- Generate professional receipts that can be printed instantly
- Access comprehensive sales and inventory reports at any time
- Manage suppliers and track product sourcing digitally

### 3.3 System Conversion Strategy

For GizmoKe, we will use a **parallel conversion strategy**. This means the new system runs alongside the old methods for a period of time before the old methods are completely phased out.

#### Why Parallel Conversion Makes Sense

- **No risk of losing data**: If the new system has technical problems, staff can still track inventory and sales using their old methods. Business operations are never interrupted.
- **Time to learn**: Users can take their time learning the new system while still having their familiar methods as backup. This reduces frustration and makes the transition smoother.
- **Confidence building**: As users see that GizmoKe works reliably, they will naturally start relying on it more. By the end of the parallel period, most staff will have completely switched.
- **Problem detection**: Running both systems together makes it easy to spot when the new system produces different results from the old methods. This helps identify and fix data entry issues or bugs quickly.
- **Accuracy verification**: Sales totals and stock levels can be cross-referenced between both systems to ensure GizmoKe is calculating everything correctly.

#### How the Parallel Run Will Work

During the parallel run period (March 28 to April 3, 2026):

1. Staff will process every sale in both the old system and GizmoKe.
2. At the end of each day, the manager will compare sales totals from both systems.
3. Stock levels will be verified against physical counts and the old records.
4. The developer will monitor the system's performance and fix any issues that arise.
5. At the end of the parallel period, staff will be surveyed about their experience.

If the parallel run goes well with no major problems, the old methods will be fully retired and GizmoKe will become the sole inventory and sales management system.

#### What If Problems Are Found?

If serious problems are found during the parallel run, we have a rollback plan:

1. Staff will be told to rely on the old system temporarily.
2. The developer will fix the problem as quickly as possible.
3. The updated system will be deployed automatically via the cloud platform.
4. The parallel run will continue until all issues are resolved.

This approach ensures that business operations are never disrupted, even if the new system encounters technical difficulties.

---

## 4. TRAINING PLAN

A powerful system is only useful if people know how to use it. The training plan for GizmoKe is designed to be practical and role-specific, focusing on the tasks each type of user needs to perform daily.

### 4.1 Training Methods

Different people learn in different ways. The training plan includes multiple methods to accommodate everyone.

#### Method 1: Written User Manual

A complete user manual will be created and shared with all staff. The manual includes:

- Step-by-step instructions for accessing the system
- Screenshots showing what each screen looks like
- Explanations of what each button and feature does
- Role-specific guides (what Admins, Managers, and Cashiers each need to know)
- Troubleshooting tips for common problems
- Answers to frequently asked questions

The manual is written in simple language without technical jargon and organized so users can quickly find the information they need.

#### Method 2: Video Tutorials

Short videos will be created showing how to use the main features of the system. Each video focuses on one specific task:

| Video | Duration |
|---|---|
| Video 1: Logging in and navigating the dashboard | 3 minutes |
| Video 2: Adding and managing products | 4 minutes |
| Video 3: Creating categories and organizing inventory | 2 minutes |
| Video 4: Processing a sale (cash and M-Pesa/Paystack) | 5 minutes |
| Video 5: Viewing and printing receipts | 2 minutes |
| Video 6: Managing suppliers | 3 minutes |
| Video 7: Generating and exporting reports | 4 minutes |
| Video 8: Managing users and roles (Admin only) | 3 minutes |
| Video 9: Configuring system settings | 3 minutes |
| Video 10: Handling low-stock alerts and reordering | 3 minutes |

The videos are kept short so staff can watch them during breaks. They can be viewed on any device with a browser.

#### Method 3: One-on-One Sessions

For staff who need extra help, the developer will be available for individual training sessions. These can be done in person or via video call. During these sessions, users can ask questions and get personalized guidance with anything they find confusing.

#### Method 4: Group Training Workshops

Group workshops will be organized for each role type. These workshops will:

- Demonstrate the features relevant to each role
- Let users practice on the live system with test data
- Answer common questions
- Collect feedback about what could be improved

Group workshops also give staff a chance to learn from each other's questions and experiences.

#### Method 5: Quick Reference Cards

A one-page quick reference card will be created for each role:

**Cashier Quick Reference:**
- How to log in
- How to process a sale
- How to search for products
- How to print a receipt
- How to view sale history

**Manager Quick Reference:**
- Everything in the Cashier card, plus:
- How to add/edit products
- How to check stock levels
- How to view reports
- How to manage suppliers and categories

**Admin Quick Reference:**
- Everything in the Manager card, plus:
- How to create and manage user accounts
- How to assign roles
- How to configure system settings
- How to view all system reports

### 4.2 What Users Will Learn

The training covers everything each user needs to know to use GizmoKe effectively:

#### Basic Skills (All Users):

- Logging into the system and understanding the dashboard
- Navigating between different sections using the sidebar
- Searching and filtering products
- Processing sales transactions
- Viewing and printing receipts
- Understanding low-stock notifications
- Changing their password

#### Intermediate Skills (Managers):

- Adding, editing, and deleting products
- Managing product categories
- Adding and managing suppliers
- Viewing sales reports and trends
- Exporting reports for external use
- Monitoring stock levels and reorder alerts

#### Advanced Skills (Administrators):

- Creating new user accounts via the user management interface
- Assigning and changing user roles (Admin, Manager, Cashier)
- Configuring company information and system settings
- Managing notification preferences
- Setting currency, timezone, and reorder thresholds
- Viewing system-wide analytics and performance data
- Deleting users and managing access control

#### Troubleshooting:

- What to do if the system is slow or unresponsive
- How to handle login problems (forgotten passwords, locked accounts)
- What to do if a sale doesn't process correctly
- How to report a bug or request a feature
- How to clear browser cache if the interface looks wrong

---

## 5. SOFTWARE MAINTENANCE PLAN

Software is never truly finished. After GizmoKe is released, it will need ongoing care to keep it working well and to add improvements. The maintenance plan explains how this will be handled.

### 5.1 Types of Maintenance

#### Corrective Maintenance

This is fixing things that are broken. Even with thorough testing, some problems may only appear when many people start using the system in real-world conditions. Corrective maintenance includes:

- Fixing crashes or errors that occur during specific operations
- Correcting calculation errors in sales totals or stock levels
- Resolving issues with receipt printing or report generation
- Fixing notification delivery problems
- Addressing any security vulnerabilities that are discovered

When a user reports a problem, the developer will investigate, find the cause, create a fix, test it, and deploy the updated version. Critical problems (system down, data loss risk, security issues) will be fixed within 24-48 hours. Minor issues (cosmetic bugs, non-critical features) will be fixed in the next regular update.

#### Adaptive Maintenance

This is changing the software to work in new situations. Examples include:

- Updating the system when browser standards change
- Adapting to changes in payment gateway APIs (e.g., Paystack updates)
- Adjusting the database structure for new business requirements
- Complying with new data protection regulations
- Supporting new device types or screen sizes

Adaptive maintenance is usually planned and scheduled rather than done urgently. It keeps the system working as the technology landscape evolves.

#### Perfective Maintenance

This is making improvements based on user feedback. Users may suggest:

- New features they would like to see (e.g., barcode scanning, customer management)
- Ways to make existing features easier to use
- Changes to the user interface for better workflow
- Improvements to report formats or dashboard visualizations
- Additional payment method integrations

Perfective maintenance is what makes the system better over time. User suggestions will be collected, reviewed, and the most popular and useful ones will be added in future versions.

#### Preventive Maintenance

This is work done to prevent problems before they happen. Examples include:

- Reviewing code for potential security issues
- Updating dependencies to newer, more secure versions
- Improving error handling and input validation
- Adding more comprehensive logging for diagnostics
- Regular database backups and integrity checks
- Performance optimization and load testing
- Monitoring server health and uptime

Preventive maintenance is done on a regular schedule to keep the system healthy and reliable.

### 5.2 Maintenance Schedule

| Maintenance Type | Frequency | Responsible Person |
|---|---|---|
| Bug fixes (urgent/critical) | As needed (within 24-48 hours) | Developer |
| Bug fixes (regular) | Monthly | Developer |
| Security updates | Quarterly | Developer |
| Performance reviews | Every 3 months | Developer |
| User feedback review | Monthly | Developer / Project Supervisor |
| New feature releases | Every 6 months | Developer |
| Database backup verification | Weekly | System Admin |
| Dependency updates | Quarterly | Developer |
| API compatibility check | Every 6 months | Developer |

### 5.3 How Users Report Problems

Users will have several ways to report problems:

1. **Email**: Users can send detailed descriptions to the developer's email address
2. **Phone/WhatsApp**: For urgent problems, users can contact the developer directly
3. **In-App Feedback**: Future versions may include a built-in feedback form

When reporting a problem, users will be asked to provide:

- What they were doing when the problem happened
- What they expected to happen
- What actually happened
- Screenshots if possible
- What browser and device they are using
- Their user role (Admin, Manager, or Cashier)

This information helps the developer find and fix problems faster.

### 5.4 Version Management

As updates are released, it is important to keep track of different versions. The system will use a simple version numbering system:

- **Version 1.0**: First release (April 2026) — Core inventory, sales, user management, and reporting
- **Version 1.1**: Bug fixes and small improvements based on initial user feedback
- **Version 1.2**: Additional report types and dashboard enhancements
- **Version 2.0**: Major new features (e.g., barcode scanning, customer loyalty, multi-branch support)

Since GizmoKe is a web application, updates are deployed automatically to the cloud. Users always access the latest version simply by refreshing their browser — no manual installation or update process is required. For major updates, users will be notified via the in-app notification system and provided with documentation on new features.

---

## 6. CHANGE MANAGEMENT PLAN

Change is hard for many people. Even when a new system is clearly better, staff may resist switching because they are comfortable with what they already know. The change management plan addresses the human side of implementing GizmoKe.

### 6.1 Why People Resist Change

Understanding why staff might resist helps us address their concerns proactively. Common reasons include:

- **Fear of the unknown**: Not knowing how the new system works can be intimidating
- **Comfort with old ways**: Staff are used to their current paper-based or spreadsheet methods
- **Fear of looking foolish**: Worrying about not being able to learn the new system, especially in front of colleagues
- **Loss of control**: Feeling like the change is being forced on them by management
- **Bad past experiences**: If previous technology changes were difficult, staff may expect the same
- **Increased accountability**: A digital system tracks every transaction, which some staff may find uncomfortable

### 6.2 How We Will Address These Concerns

#### Communication

Throughout the implementation process, there will be clear and frequent communication about:

- Why the new system is being introduced and the business problems it solves
- What specific benefits it will bring to each role (less paperwork for cashiers, better reports for managers, full visibility for admins)
- When changes will happen and what the timeline looks like
- How staff will be supported throughout the transition

No surprises. Everyone will know what to expect and when.

#### Involvement

Staff will be involved in the process from the beginning. They will:

- Be asked about pain points in their current workflow
- Have a chance to test the system during the parallel run period
- Provide feedback that will be used to make improvements
- Help identify problems before the full transition

When people feel involved, they are more likely to support the change.

#### Support

A strong support system will be in place to help staff through the transition:

- The developer will be available to answer questions during business hours
- Training materials (manuals, videos, reference cards) will be easily accessible
- There will be multiple ways to get help (in-person, phone, WhatsApp, email)
- No question is too small or silly to ask
- A designated "super user" in each department can provide peer support

#### Demonstrating Benefits

Staff will be shown concrete examples of how GizmoKe makes their work easier:

- **Cashiers**: Process sales in seconds instead of minutes; automatic receipt generation
- **Managers**: Real-time stock visibility; automated low-stock alerts instead of manual checks; instant reports
- **Admins**: Complete business overview on one dashboard; centralized user and role management; audit trail of all transactions

When people see clear, tangible benefits relevant to their own role, they are more motivated to learn.

### 6.3 Roles and Responsibilities

| Role | Who | Responsibilities |
|---|---|---|
| Change Sponsor | Business Owner / Project Supervisor | Approves the change, provides resources, shows visible support |
| Change Agent | Developer | Drives the change, provides training, answers questions, deploys updates |
| Change Champions | Senior Staff / Managers | Encourage adoption, provide peer support, escalate concerns |
| Change Target | All Staff (Cashiers, Managers) | Learn and adopt the new system, provide honest feedback |

### 6.4 Measuring Success

We will know the change is successful when:

- 100% of staff have active accounts and can log in successfully
- 90% of daily sales are processed through GizmoKe within two weeks of go-live
- Stock levels in the system match physical counts to within 2% accuracy
- User feedback is generally positive (satisfaction score of 4/5 or higher)
- Fewer than 5 support requests per week after the first month
- Report generation time is reduced from hours (manual) to seconds (digital)
- Staff voluntarily stop using the old paper/spreadsheet methods

### 6.5 Handling Resistance

If some staff members are particularly resistant, we will:

1. **Listen** to their concerns without getting defensive
2. **Acknowledge** that change is difficult and their feelings are valid
3. **Explain** the specific benefits relevant to their role
4. **Offer** additional one-on-one training and support
5. **Pair** them with a colleague who is comfortable with the system
6. **Celebrate** their progress and acknowledge when they use the system successfully
7. **Follow up** regularly to ensure they are not struggling silently

The goal is not to force compliance but to help everyone see the value in the new system and feel confident using it. With patience, good training, and strong support, even the most resistant users will come around.

---

*Document prepared for the GizmoKe Inventory Management System implementation.*
*Date: March 2026*
