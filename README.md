# Typeflow Finance - Frontend

A modern, responsive financial management web application frontend built with React, featuring a beautiful UI powered by shadcn/ui components and secure authentication via Auth0. The application provides an intuitive dashboard for managing personal finances, tracking transactions, and generating insightful reports.

## Demo link :-
https://drive.google.com/file/d/1T1i2fIhzW2mRZ403Cv_Zh4z3MUXrlN_s/view?usp=sharing

## 🏗️ Project Structure

```
frontend/
├── node_modules/           # Project dependencies
├── public/                # Static public assets
├── src/                   # Source code
│   ├── assets/            # Static assets (images, icons, etc.)
│   ├── components/        # Reusable UI components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   │   ├── DashboardStats.jsx    # Statistics cards and metrics
│   │   │   ├── GettingStarted.jsx    # Onboarding component
│   │   │   └── QuickActions.jsx      # Quick action buttons
│   │   ├── layout/        # Layout components
│   │   │   └── Header.jsx            # Application header/navigation
│   │   ├── modals/        # Modal dialog components
│   │   │   ├── PdfUploadModal.jsx        # PDF document upload
│   │   │   ├── ReportsModal.jsx          # Report generation modal
│   │   │   ├── ScanReceiptModal.jsx      # Receipt scanning modal
│   │   │   ├── TransactionFormModal.jsx  # Transaction creation/edit
│   │   │   └── TransactionListModal.jsx  # Transaction listing modal
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utility libraries and configurations
│   │   └── utils.js       # Helper functions and utilities
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx  # Main dashboard page
│   │   ├── LandingPage.jsx # Marketing/landing page
│   │   ├── App.jsx        # Root application component
│   │   ├── index.css      # Global styles
│   │   └── main.jsx       # Application entry point
├── .env                   # Environment variables
├── .gitignore            # Git ignore configuration
└── components.json       # shadcn/ui component configuration
```
## Flow Diagram
![Alert](https://github.com/user-attachments/assets/fc2ecac8-880c-4781-a8e2-9adf41f18a12)

## 🚀 Features

- **Modern Dashboard**: Comprehensive financial overview with interactive charts and statistics
- **Transaction Management**: Easy-to-use forms for adding, editing, and categorizing transactions
- **Receipt Scanning**: OCR-powered receipt scanning for automatic transaction creation
- **PDF Processing**: Upload and process financial documents
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **Secure Authentication**: Auth0 integration for robust user authentication and authorization
- **Beautiful UI**: Modern interface built with shadcn/ui components and Tailwind CSS

## 🛠️ Technologies Used

- **Framework**: React 18+ with Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Authentication**: Auth0
- **State Management**: React Context API / Zustand (inferred)
- **Routing**: React Router
- **HTTP Client**: Axios/Fetch API
- **Charts**: Recharts/Chart.js (for dashboard statistics)
- **Form Handling**: React Hook Form
- **File Processing**: PDF.js for PDF handling
- **Icons**: Lucide React icons

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- npm or yarn package manager
- Auth0 account and application setup
- Backend API running (Typeflow Finance Backend)

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd typeflow-finance/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Auth0 Configuration
   VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your_auth0_client_id
   VITE_AUTH0_AUDIENCE=your_api_audience
   VITE_AUTH0_REDIRECT_URI=http://localhost:3000
   
   # API Configuration
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_BACKEND_URL=http://localhost:5000
   
   # App Configuration
   VITE_APP_NAME=Typeflow Finance
   VITE_APP_VERSION=1.0.0
   ```

4. **Configure shadcn/ui components**
   ```bash
   npx shadcn-ui@latest init
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 UI Components

### Dashboard Components

#### DashboardStats.jsx
- Financial metrics and KPI cards
- Interactive charts and graphs
- Monthly/yearly comparisons
- Category-wise spending breakdowns

#### GettingStarted.jsx
- Onboarding experience for new users
- Setup wizard for initial configuration
- Feature highlights and tutorials

#### QuickActions.jsx
- Rapid transaction entry
- Quick category selection
- Recent actions shortcuts

### Modal Components

#### TransactionFormModal.jsx
- Create and edit transactions
- Category assignment
- Date and amount validation
- Receipt attachment support

#### ScanReceiptModal.jsx
- Camera integration for receipt capture
- OCR processing interface
- Manual correction capabilities
- Automatic transaction creation

#### ReportsModal.jsx
- Report parameter selection
- Date range pickers
- Export options (PDF, CSV)
- Preview functionality

## 🔐 Authentication Flow

The application uses Auth0 for authentication:

1. **Login Process**: Users are redirected to Auth0 login
2. **Token Management**: JWT tokens are handled automatically
3. **Protected Routes**: Dashboard and user-specific features require authentication
4. **Profile Management**: User profile information from Auth0
5. **Logout**: Secure session termination

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablet screens
- **Desktop Experience**: Full-featured desktop interface
- **Touch Friendly**: Gesture support for mobile interactions

## 🎯 Page Components

### Dashboard.jsx
- Main application interface
- Financial overview widgets
- Transaction list and filters
- Quick action buttons
- Real-time data updates

### LandingPage.jsx
- Marketing homepage
- Feature showcase
- Pricing information
- Call-to-action sections
- User testimonials

## 🛡️ Security Features

- **Auth0 Integration**: Enterprise-grade authentication
- **Token Validation**: Automatic token refresh and validation
- **Protected Routes**: Route-level access control
- **Secure API Calls**: Authenticated requests to backend
- **XSS Protection**: Input sanitization and validation

## 🎨 Styling and Theming

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom color palette for financial app
      }
    }
  }
}
```

### shadcn/ui Integration
- Consistent component design system
- Customizable theme variables
- Dark/light mode support
- Accessible component variants

## 📊 Dashboard Features

### Financial Statistics
- Total balance and net worth
- Monthly income vs expenses
- Category-wise spending analysis
- Transaction trends and patterns

### Interactive Charts
- Income/expense trends over time
- Category distribution pie charts
- Monthly comparison bar charts
- Goal tracking progress bars

### Quick Actions
- Add new transaction
- Scan receipt
- Generate report
- Upload financial documents

## 🔧 Configuration Files

### components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```


### Environment Variables for Production
```env
VITE_AUTH0_DOMAIN=your-production-domain.auth0.com
VITE_API_BASE_URL=https://your-production-api.com/api
VITE_AUTH0_REDIRECT_URI=https://your-domain.com
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the component naming conventions
4. Add appropriate tests
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🎯 Performance Optimization

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Compressed and responsive images
- **Bundle Analysis**: Regular bundle size monitoring
- **CDN**: Static asset delivery optimization


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Typeflow Finance Frontend** - Beautiful, secure, and intuitive financial management interface.
