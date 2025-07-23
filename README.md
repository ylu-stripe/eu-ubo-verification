# EU UBO Verification Flow

A React application simulating the EU Beneficial Ownership verification process for compliance.

## 🚀 Quick Start

```bash
npm install
npm start
```

Visit `http://localhost:3000` to access the application.

## 📧 Email Integration

Open `email-notification.html` in a browser to see the email notification. The "View account status" button links directly to the ASH dashboard.

## 🔄 User Journey

### Entry Point: Account Status Home (ASH)
- **URL**: `/ash` (default route)
- Users land here from email notifications
- Shows urgent UBO verification task with due date
- Displays account information and current status

### UBO Verification Flow
1. **Verify Ownership** (`/verify-ownership`)
   - Introduction to UBO requirements
   - Explanation of data collection process

2. **Confirm Structure** (`/confirm-structure`) 
   - Review government database business information
   - Company details from official registers

3. **Confirm Owners** (`/confirm-owners`)
   - Review beneficial owners from government data
   - **Agree** → Verification complete
   - **Disagree** → Edit owners

4. **Edit Owners** (`/edit-owners`) [If disagreeing]
   - Modify beneficial ownership information
   - Add/remove/edit owners
   - Validation (must total 100%)
   - Leads to attestation/document upload (simulated)

## 🎯 Key Features

- **Responsive Design**: Clean, modern interface
- **Mock Data**: Realistic company and owner information
- **Flow Validation**: Ownership percentages must total 100%
- **Navigation Logic**: Proper back/cancel handling
- **Entry Tracking**: Maintains context throughout flow
- **Completion States**: Clear success messages and redirects

## 📁 Project Structure

```
src/
├── components/
│   ├── ASHEntry.tsx          # Account Status Home (main entry)
│   ├── VerifyOwnership.tsx   # UBO introduction
│   ├── ConfirmStructure.tsx  # Business info confirmation
│   ├── ConfirmOwners.tsx     # Owner list confirmation
│   └── EditOwners.tsx        # Owner editing interface
├── data/
│   └── mockData.ts           # Mock company/owner data
├── App.tsx                   # Main routing
└── App.css                   # Global styles
```

## 🔧 Next Steps

Future enhancements could include:
- KYB verification flows (for failed KYB users)
- KYC verification flows (for high-risk accounts)  
- Attestation signing interface
- Document upload functionality
- User session management
- Different branching logic based on user type 