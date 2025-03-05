# Software Requirements Specification (SRS)
## E-commerce Web Application (Minimal Viable Product)

---

### 1. **Introduction**
#### 1.1 Purpose  
The purpose of this document is to outline the requirements for developing a minimal e-commerce web application focused on core functionalities: user registration, product browsing via categories/filters, and cart management.  

#### 1.2 Scope  
The application will:  
- Allow users to register and log in via email.  
- Display products organized by filter-based categories.  
- Enable users to add/remove items to a cart and adjust quantities.  
- Be fully responsive across devices.  
- Exclude payment processing, shipping, taxes, and post-launch product management.  

#### 1.3 Definitions  
- **Guest User**: A user who browses without registering.  
- **Cart**: A temporary storage for selected products before checkout (checkout excluded in MVP).  

---

### 2. **Overall Description**
#### 2.1 User Needs  
- Customers want to browse products easily and save items to a cart for future purchase intent.  
- Users need a seamless registration process and responsive design.  

#### 2.2 Assumptions  
- Products are pre-loaded during initial deployment and will not be updated dynamically.  
- No payment, shipping, or tax calculations are required.  

---

### 3. **System Features**
#### 3.1 User Registration & Authentication  
- **Registration**: Email-only signup with password validation.  
- **Login**: Email and password authentication.  
- **Role**: Single role (Customer). No admin/manager roles.  

#### 3.2 Product Catalog  
- **Categories**: Products organized by static filters (e.g., price range, popularity).  
- **Product Display**:  
  - Product images, titles, descriptions, and prices.  
  - No dynamic categories (e.g., "Trending").  

#### 3.3 Shopping Cart  
- **Add/Remove Items**: Users can add/remove products.  
- **Quantity Adjustment**: Modify item quantities in the cart.  
- **Cart Persistence**: Cart data persists until the user logs out.  

#### 3.4 User Interface (UI)  
- **Responsive Design**: Works on mobile, tablet, and desktop.  
- **Clean Layout**: Intuitive navigation with minimalistic design (no brand guidelines provided).  

#### 3.5 Backend System  
- **Framework**: Python with Flask for backend logic.  
- **API Endpoints**: RESTful APIs for:  
  - User registration/login (`/register`, `/login`).  
  - Product listing (`/products`).  
  - Cart operations (`/cart/add`, `/cart/remove`).  

#### 3.6 Database  
- **Database Engine**: SQLite for data storage.  
- **Tables**:  
  - `Users`: Stores user credentials (email, hashed password).  
  - `Products`: Pre-loaded product details (ID, name, description, price, category).  
  - `Carts`: Cart items linked to user sessions (user_id, product_id, quantity).  
- **ORM**: SQLAlchemy for database interactions and schema management.  

---

### 4. **Non-Functional Requirements**
#### 4.1 Performance  
- Page load time < 3 seconds on average network speeds.  
- SQLite database queries optimized with indexing.  

#### 4.2 Security  
- HTTPS for all communications.  
- Passwords stored using bcrypt hashing.  
- Flask security extensions (e.g., Flask-Login) for session management.  

#### 4.3 Usability  
- Intuitive navigation for users with minimal onboarding.  

#### 4.4 Compatibility  
- **Frontend**: Support for modern browsers (Chrome, Firefox, Safari, Edge).  
- **Backend**: Compatible with Python 3.8+ and Flask 2.0+.  

---

### 5. **Success Criteria**  
1. 95% of users successfully register and log in.  
2. 80% of users add at least 2 items to the cart during their first session.  
3. Application functions seamlessly on screen sizes ≥320px (mobile) to 1920px (desktop).  
4. Zero critical security vulnerabilities at launch.  

---

### 6. **Exclusions**  
The following are **out of scope**:  
- Payment gateway integration.  
- Shipping, tax calculations, or order tracking.  
- Product management post-deployment.  
- User roles beyond "Customer."  
- Social media logins or third-party integrations.  

---

### 7. **Deployment Notes**  
- Backend hosted using a WSGI server (e.g., Gunicorn) during deployment.  
- SQLite database stored locally; migration to a scalable database (e.g., PostgreSQL) may be required for future scaling.  

---

**Approved By**: [Your Name/Team]  
**Version**: 1.1  
**Date**: [Insert Date]