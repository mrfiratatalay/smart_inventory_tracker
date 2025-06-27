# 📦 Smart Inventory Tracker

A modern, full-stack inventory management system built with **Next.js 15**, **MongoDB**, **Prisma**, and **NextAuth.js**. This project demonstrates advanced web development patterns including Server Actions, authentication, form validation, and user-specific data management.

## 🚀 Live Demo

**Demo Account:**

- Email: `demo@example.com`
- Password: `demo123`

## ✨ Features

### 🔐 **Authentication System**

- **NextAuth.js Integration** with multiple providers
- **Demo Account** for instant testing
- **Google & GitHub OAuth** support (configurable)
- **User-specific data** - each user sees only their inventory
- **Session management** with database persistence

### 📋 **Inventory Management**

- **CRUD Operations** - Create, Read, Update, Delete inventory items
- **Real-time Validation** with Zod schema validation
- **Professional Form Management** using React Hook Form
- **Advanced Search & Filtering** by name, category, SKU
- **Inventory Statistics** - total items, value, low stock alerts
- **SKU Generation** with uniqueness validation

### 🎨 **Modern UI/UX**

- **Responsive Design** with Tailwind CSS
- **Professional Form Components** with real-time feedback
- **Loading States** and error handling
- **Beautiful Authentication Pages**
- **Tabbed Interface** for organized navigation

### ⚡ **Advanced Technical Features**

- **Next.js 15 Server Actions** for server-side form processing
- **MongoDB with Prisma ORM** for type-safe database operations
- **Zustand State Management** for client-side state
- **TypeScript** throughout the entire application
- **Multi-user Architecture** with proper data isolation

## 🛠️ Technologies Used

### **Frontend**

- **Next.js 15** with App Router
- **React 18** with Hooks and Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** + **Zod** for form management
- **Zustand** for state management

### **Backend**

- **Next.js API Routes** with authentication
- **NextAuth.js** for authentication
- **Prisma ORM** for database operations
- **MongoDB** with replica set support
- **Server Actions** for modern form handling

### **Development Tools**

- **ESLint** for code quality
- **TypeScript** for type checking
- **Prisma Studio** for database management

## 📋 Prerequisites

- **Node.js 18+**
- **MongoDB** (local with replica set OR MongoDB Atlas)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone [your-repo-url]
cd smart_inventory_tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env.local` file:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/SmartInventory?replicaSet=rs0&directConnection=true"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Optional OAuth (for Google/GitHub login)
# GOOGLE_CLIENT_ID="your-google-client-id"
# GOOGLE_CLIENT_SECRET="your-google-client-secret"
# GITHUB_ID="your-github-client-id"
# GITHUB_SECRET="your-github-client-secret"
```

### 4. Database Setup

```bash
# Push schema to MongoDB
npx prisma db push

# Optional: Open Prisma Studio
npx prisma studio
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and sign in with the demo account!

## 📱 User Journey

### **1. Authentication**

1. Visit the application
2. Get redirected to sign-in page
3. Use demo account (`demo@example.com` / `demo123`) or OAuth
4. Successfully authenticated and redirected to dashboard

### **2. Adding Inventory Items**

1. Click "Add Item" tab
2. Fill out the professional form with validation
3. See real-time validation feedback
4. Submit using Server Actions
5. Item appears in your personal inventory

### **3. Managing Inventory**

1. View all your items in the "Inventory" tab
2. Search by name, filter by category
3. See inventory statistics (total value, item count)
4. Edit items with inline editing
5. Delete items with confirmation

### **4. Multi-User Experience**

1. Each user sees only their own data
2. SKUs are globally unique across all users
3. Secure server-side validation and authorization

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes with authentication
│   ├── auth/              # Authentication pages
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   ├── InventoryForm.tsx  # Professional form with validation
│   ├── InventoryList.tsx  # List with search/filtering
│   └── InventoryItem.tsx  # Individual item component
├── lib/                   # Utility functions
│   ├── actions.ts         # Next.js 15 Server Actions
│   ├── auth.ts           # NextAuth.js configuration
│   ├── prisma.ts         # Database connection
│   └── validations.ts    # Zod schemas
├── store/                 # State management
│   └── inventoryStore.ts  # Zustand store
└── types/                 # TypeScript definitions
    ├── inventory.ts       # Inventory types
    └── next-auth.d.ts     # NextAuth type extensions
```

## 🔧 Database Schema

```prisma
model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  email         String?   @unique
  name          String?
  role          UserRole  @default(USER)
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
  user        User     @relation(fields: [userId], references: [id])
}
```

## 🧪 Testing

### **Manual Testing Checklist**

- [ ] Authentication flow works
- [ ] Demo account creates user in database
- [ ] CRUD operations function correctly
- [ ] Form validation prevents invalid submissions
- [ ] Search and filtering work
- [ ] User can only see their own data
- [ ] SKU uniqueness is enforced
- [ ] Server Actions handle errors gracefully

### **API Endpoints**

- `GET /api/inventory` - Get user's inventory items
- `POST /api/inventory` - Create new inventory item
- `PUT /api/inventory/[id]` - Update inventory item
- `DELETE /api/inventory/[id]` - Delete inventory item
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

## 📈 Performance & Best Practices

- **Server-Side Rendering** for better SEO and performance
- **Database Indexing** on user IDs and SKUs
- **Type Safety** throughout the application
- **Error Boundaries** for graceful error handling
- **Optimistic Updates** for better UX
- **Security** with proper authentication and authorization

## 🚀 Deployment

### **Vercel (Recommended)**

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### **Environment Variables for Production**

```env
DATABASE_URL="your-mongodb-atlas-connection-string"
NEXTAUTH_SECRET="generate-a-secure-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-secret"
```

## 🏆 Internship-Ready Features

This project demonstrates **production-level** development skills:

✅ **Modern React Patterns** - Hooks, Server Components, Server Actions  
✅ **Authentication & Authorization** - Multi-provider, secure, user-specific data  
✅ **Database Design** - Relational modeling, proper indexing, data integrity  
✅ **Form Management** - Professional validation, error handling, UX patterns  
✅ **State Management** - Client and server state coordination  
✅ **TypeScript Proficiency** - Type safety, interfaces, generics  
✅ **API Design** - RESTful endpoints, proper HTTP status codes  
✅ **Security** - Input validation, SQL injection prevention, XSS protection  
✅ **Performance** - Optimized queries, caching, lazy loading  
✅ **Documentation** - Comprehensive README, code comments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ for internship applications and portfolio demonstrations.**
