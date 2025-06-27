# 📦 Smart Inventory Tracker

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6-green?style=for-the-badge&logo=mongodb)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)

_A modern, full-stack inventory management system built with cutting-edge technologies_

[🚀 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [⚡ Quick Start](#-quick-start) • [📖 Documentation](#-api-documentation)

</div>

---

## 🌟 Overview

**Smart Inventory Tracker** is a professional-grade inventory management system that demonstrates modern full-stack development principles. Built with **Next.js 15**, **MongoDB**, **Prisma ORM**, and **NextAuth.js**, it showcases advanced patterns including Server Actions, role-based authentication, and real-time form validation.

### 🎯 **Demo Access**

```
📧 Email: demo@example.com
🔑 Password: demo123
```

---

## ✨ Features

### 🔐 **Multi-Provider Authentication**

- **🚀 Quick Demo Access** - Instant login with demo credentials
- **🔑 Credentials Authentication** - Secure email/password login with bcrypt hashing
- **👥 OAuth Integration** - Google & GitHub provider support (configurable)
- **🎭 Role-Based Access** - USER and ADMIN roles with different permissions
- **🔒 Protected Routes** - Automatic authentication checks and redirects

### 📊 **Smart Inventory Management**

- **✅ Complete CRUD Operations** - Create, read, update, and delete inventory items
- **🎯 Real-Time Validation** - Zod schema validation with instant feedback
- **🔍 Advanced Search & Filtering** - Search by name, description, SKU, or category
- **📈 Live Statistics Dashboard** - Total items, inventory value, stock alerts
- **⚡ Server Actions** - Modern server-side form processing
- **🏷️ SKU Management** - Unique identifier system with format validation

### 🎨 **Professional UI/UX**

- **📱 Fully Responsive Design** - Optimized for desktop, tablet, and mobile
- **🎨 Modern Interface** - Clean design with Tailwind CSS
- **⚙️ Tabbed Navigation** - Organized workflow with intuitive navigation
- **📊 Visual Feedback** - Loading states, error handling, and success notifications
- **🎯 Smart Stock Indicators** - Color-coded stock status (In Stock, Low Stock, Out of Stock)

### 👑 **Admin Features**

- **🌐 System-Wide View** - Admins can view all users' inventory items
- **📊 Admin Dashboard** - System statistics and user management insights
- **🔧 Cross-User Management** - Edit/delete any user's items (admin only)
- **👥 User Information** - See item ownership and user roles

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="50%">

### **Frontend**

- **⚛️ Next.js 15** - React framework with App Router
- **🔷 TypeScript** - Type-safe development
- **🎨 Tailwind CSS** - Utility-first styling
- **📝 React Hook Form** - Form management
- **✅ Zod** - Schema validation
- **🏪 Zustand** - State management

</td>
<td width="50%">

### **Backend**

- **🔗 Next.js API Routes** - Serverless functions
- **🔐 NextAuth.js** - Authentication solution
- **🗄️ MongoDB** - NoSQL database
- **🔄 Prisma ORM** - Database toolkit
- **🔒 bcrypt** - Password hashing
- **⚡ Server Actions** - Modern data mutations

</td>
</tr>
</table>

---

## ⚡ Quick Start

### **📋 Prerequisites**

- Node.js 18+
- MongoDB (local or Atlas)
- Git

### **1. 📥 Clone & Install**

```bash
git clone [your-repo-url]
cd smart_inventory_tracker
npm install
```

### **2. 🔧 Environment Setup**

Create `.env.local`:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/SmartInventory?replicaSet=rs0&directConnection=true"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key-minimum-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

### **3. 🗄️ Database Setup**

#### **Option A: MongoDB Atlas (Recommended)**

1. Create free account at [MongoDB Atlas](https://mongodb.com/atlas)
2. Create new cluster (M0 Sandbox - Free)
3. Configure database user and network access
4. Copy connection string to `DATABASE_URL`

#### **Option B: Local MongoDB**

```bash
# Install MongoDB locally
brew install mongodb-community  # macOS
sudo apt install mongodb         # Ubuntu

# Start with replica set (required for Prisma)
mongod --replSet rs0
mongosh --eval "rs.initiate()"
```

### **4. 🚀 Initialize Database**

```bash
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
npx prisma studio        # (Optional) Database GUI
```

### **5. 🏃‍♂️ Start Development**

```bash
npm run dev
```

Visit **http://localhost:3000** and sign in with demo account! 🎉

---

## 📱 User Experience

### **🔐 Authentication Flow**

1. **Landing Page** → Automatic redirect to sign-in for guests
2. **Sign-In Options** → Demo account, OAuth providers, or credentials
3. **Dashboard Access** → Personalized inventory dashboard
4. **Role Recognition** → Different UI for users vs admins

### **📦 Inventory Management**

1. **View Items** → Browse your inventory with search/filtering
2. **Add Items** → Professional form with real-time validation
3. **Edit Items** → Click edit button for inline editing
4. **Delete Items** → Confirmation dialog for safe deletion
5. **Statistics** → Real-time calculations of total value and stock levels

### **👑 Admin Experience**

1. **Global View** → See all users' inventory items
2. **Admin Panel** → System statistics and insights
3. **Cross-User Management** → Edit/delete any user's items
4. **User Identification** → Clear owner badges on items

---

## 🏗️ Project Architecture

```
smart_inventory_tracker/
├── 📁 prisma/
│   └── schema.prisma          # Database schema
├── 📁 src/
│   ├── 📁 app/               # Next.js App Router
│   │   ├── 📁 api/          # API endpoints
│   │   │   ├── auth/        # Authentication routes
│   │   │   ├── inventory/   # Inventory CRUD
│   │   │   └── admin/       # Admin statistics
│   │   ├── 📁 auth/         # Auth pages
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main dashboard
│   ├── 📁 components/       # React components
│   │   ├── InventoryForm.tsx    # Add/edit form
│   │   ├── InventoryList.tsx    # Items list + stats
│   │   └── InventoryItem.tsx    # Individual item card
│   ├── 📁 lib/              # Utilities
│   │   ├── actions.ts       # Server Actions
│   │   ├── auth.ts          # NextAuth config
│   │   ├── prisma.ts        # DB connection
│   │   └── validations.ts   # Zod schemas
│   ├── 📁 store/            # State management
│   │   └── inventoryStore.ts    # Zustand store
│   └── 📁 types/            # TypeScript types
│       └── inventory.ts         # Type definitions
```

---

## 📖 API Documentation

| Method   | Endpoint                  | Description                          | Authentication | Parameters                                                    |
| -------- | ------------------------- | ------------------------------------ | -------------- | ------------------------------------------------------------- |
| `GET`    | `/api/inventory`          | Retrieve user's inventory items      | Required       | `search`, `category`, `limit`, `offset`                       |
| `POST`   | `/api/inventory`          | Create new inventory item            | Required       | `name`, `description`, `quantity`, `price`, `category`, `sku` |
| `PUT`    | `/api/inventory/[id]`     | Update existing inventory item       | Required       | Item `id` + update fields                                     |
| `DELETE` | `/api/inventory/[id]`     | Delete inventory item                | Required       | Item `id`                                                     |
| `GET`    | `/api/admin/stats`        | Get system-wide statistics           | Admin Only     | None                                                          |
| `POST`   | `/api/auth/[...nextauth]` | NextAuth.js authentication endpoints | None           | Provider-specific                                             |

---

## 🗄️ Database Schema

```prisma
model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?   // For credentials auth
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts       Account[]
  sessions       Session[]
  inventoryItems InventoryItem[]
}

model InventoryItem {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String?
  quantity    Int      @default(0)
  price       Float    @default(0.0)
  category    String?
  sku         String?  @unique
  userId      String   @db.ObjectId
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum UserRole {
  USER
  ADMIN
  MANAGER
}
```

---

## 🧪 Testing & Validation

### **✅ Manual Testing Checklist**

- [ ] **Authentication**
  - [ ] Demo account login/logout
  - [ ] OAuth provider integration
  - [ ] Session persistence
  - [ ] Protected route redirects
- [ ] **Inventory Operations**
  - [ ] Create items with validation
  - [ ] View items with proper formatting
  - [ ] Update items (own/admin)
  - [ ] Delete items with confirmation
- [ ] **Data Security**
  - [ ] User data isolation
  - [ ] SKU uniqueness validation
  - [ ] Role-based permissions
  - [ ] Server-side validation

### **🔒 Security Features**

- ✅ **Input Validation** - Zod schemas on client and server
- ✅ **Authentication** - NextAuth.js with secure sessions
- ✅ **Authorization** - Role-based access control
- ✅ **Data Isolation** - Users only see their own data
- ✅ **Password Security** - bcrypt hashing
- ✅ **SQL Injection Prevention** - Prisma ORM parameterized queries

---

## 🚀 Deployment

### **▲ Vercel (Recommended)**

1. Connect GitHub repository to Vercel
2. Configure environment variables in dashboard
3. Deploy automatically on push

### **🐳 Docker Alternative**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **🔧 Environment Variables (Production)**

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/production"
NEXTAUTH_SECRET="secure-random-secret-32-chars-minimum"
NEXTAUTH_URL="https://your-domain.com"
```

---

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Production build
npm run start            # Start production server

# Database
npx prisma generate      # Generate client
npx prisma db push       # Push schema changes
npx prisma studio        # Database GUI

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript validation
```

---

## 🏆 Skills Demonstrated

<div align="center">

| **Frontend Excellence**     | **Backend Mastery**               | **Best Practices**       |
| --------------------------- | --------------------------------- | ------------------------ |
| ⚛️ Modern React Patterns    | 🗄️ Database Design                | 📝 TypeScript Throughout |
| 🎨 Responsive UI/UX         | 🔐 Authentication & Authorization | ✅ Input Validation      |
| ⚡ Performance Optimization | 🔄 API Design                     | 🧪 Testing Mindset       |
| 📱 Mobile-First Design      | 🔒 Security Implementation        | 📚 Documentation         |

</div>

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for modern web development**

_Showcasing production-ready full-stack development skills_

[⬆️ Back to Top](#-smart-inventory-tracker)

</div>
