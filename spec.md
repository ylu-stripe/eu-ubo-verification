# UBO Verification System - Technical Specification

## Project Overview

The UBO (Ultimate Beneficial Owner) Verification System is a React-based web application that helps businesses comply with EU Anti-Money Laundering (AML) regulations by guiding them through the process of identifying and verifying beneficial ownership information.

### Business Context
- **Regulatory Requirement**: EU law requires businesses to identify individuals who own 25%+ of a company or exercise significant control
- **Compliance Deadline**: Businesses face account restrictions if verification is not completed by specified deadlines
- **Multiple Scenarios**: System handles various business structures from simple ownership to complex organizational hierarchies

## System Architecture

### Technology Stack
- **Frontend**: React with TypeScript
- **State Management**: React Context API
- **Routing**: React Router
- **Styling**: CSS with component-based styles
- **UI Components**: Modal-based interface with progressive disclosure

### Core Data Models

```typescript
interface BeneficialOwner {
  id: string;
  name: string;
  percentage: number;
  ownershipType: 'direct' | 'indirect';
  role?: string;
  isExisting?: boolean;
}

interface FlowParameters {
  ubosFound: boolean;
  directorsFound: boolean;
  legalEntityMatch: 'trulioo_stripe' | 'trulioo_no_response' | 'trulioo_not_stripe';
  kybComplete: boolean;
  kybRequiresManualReview: boolean;
  kybMvrComplete: boolean;
  kybRequirementComplete: boolean;
  uboRequirementComplete: boolean;
  twoWayMatch?: boolean;
}

interface CompanyData {
  companyName: string;
  beneficialOwners: BeneficialOwner[];
  directors: BeneficialOwner[];
}
```

## User Flows

### Primary Flow: Standard UBO Verification

1. **Entry Point** (`/ash`)
   - Dashboard showing urgent tasks
   - UBO verification task with deadline
   - Click triggers verification flow

2. **Get Started** (`/verify-ownership`)
   - Introduction to UBO requirements
   - Explanation of data collection process
   - Progress stepper showing 4 steps

3. **Confirm Structure** (`/confirm-structure`)
   - Display company information from government records
   - Show data source and match status
   - Option to edit business structure if data mismatch

4. **Confirm Owners** (`/confirm-owners`)
   - Display beneficial owners from government data
   - Show ownership percentages and types
   - Two options: "Confirm" or "No, edit owners"

5. **Edit Owners** (`/edit-owners`) - If user chooses to edit
   - Add/remove/modify beneficial owners
   - Real-time validation (must total 100%)
   - Support for both direct and indirect ownership

6. **Verification Method** (`/verification-method`)
   - Choose between electronic attestation or document upload
   - Electronic: immediate e-signature flow
   - Upload: manual document submission with review

7. **Success** (`/success`)
   - Confirmation of completion
   - Different messaging based on verification method
   - Return to dashboard

### Alternative Flow: No UBOs Found

1. **No UBOs Found** (`/no-ubos-found`)
   - Message indicating no beneficial owners detected
   - Two options: "Continue with no owners" or "Add beneficial owners"

2. **Company Information** (`/company-information`) - If adding owners
   - Choose between simple or complex structure
   - Simple: direct to edit owners
   - Complex: organizational tree builder

3. **Directors Flow** - If continuing with no owners
   - Switch to directors/executives verification
   - Similar flow but for directors instead of beneficial owners

### Organizational Tree Flow

1. **Org Tree Builder** (`/org-tree-builder`)
   - Interface for complex organizational structures
   - Simulates analysis of corporate hierarchy
   - Results in either UBO identification or directors flow

## Technical Implementation Details

### State Management

**UBOContext** manages global application state:

```typescript
interface UBOContextType {
  // Core data
  activeOwners: BeneficialOwner[];
  removedOwners: BeneficialOwner[];
  newOwners: BeneficialOwner[];
  directors: BeneficialOwner[];
  
  // Flow control
  flowParams: FlowParameters;
  verificationMethod: 'electronic' | 'upload' | null;
  
  // State mutations
  setActiveOwners: (owners: BeneficialOwner[]) => void;
  setRemovedOwners: (owners: BeneficialOwner[]) => void;
  setDirectors: (directors: BeneficialOwner[]) => void;
  setFlowParams: (params: FlowParameters) => void;
  
  // Business logic
  hasChanges: () => boolean;
  hasDirectorChanges: () => boolean;
  shouldShowDirectors: () => boolean;
  isDirectorsFlow: () => boolean;
  resetState: () => void;
}
```

### Routing Structure

```
/ash                    - Account Status Home (main dashboard)
/verify-ownership       - Flow introduction
/confirm-structure      - Business information confirmation
/confirm-owners         - UBO confirmation
/edit-owners           - UBO editing interface
/confirm-directors     - Directors confirmation (alternative flow)
/edit-directors        - Directors editing interface
/no-ubos-found         - No UBOs detected page
/company-information   - Structure complexity selection
/org-tree-builder      - Complex organization handler
/verification-method   - Choose verification approach
/document-review-status - Upload verification status
/review-attestation    - Electronic signature review
/success               - Completion confirmation
```

### Component Structure

```
src/
├── components/
│   ├── ASHEntry.tsx              # Main dashboard
│   ├── flows/
│   │   ├── ubo/
│   │   │   ├── CompanyInformation.tsx
│   │   │   ├── ConfirmPage.tsx    # Beneficial owners confirmation
│   │   │   ├── ConfirmStructure.tsx
│   │   │   ├── EditPage.tsx       # Owner/director editing
│   │   │   └── SuccessPage.tsx
│   │   ├── no-ubos/
│   │   │   ├── NoUBOsFound.tsx
│   │   │   └── NoUBOsTransition.tsx
│   │   ├── org-tree/
│   │   │   └── OrgTreeBuilder.tsx
│   │   └── verification/
│   │       ├── VerifyOwnership.tsx # Flow introduction
│   │       ├── VerificationMethod.tsx
│   │       ├── DocumentReview.tsx
│   │       ├── ESignModal.tsx
│   │       └── ReviewAttestation.tsx
│   └── ui/
│       └── Modal.tsx              # Reusable modal component
├── contexts/
│   └── UBOContext.tsx            # Global state management
└── data/
    └── mockData.ts               # Mock company/owner data
```

## Business Rules & Validation

### Ownership Validation
- Total ownership percentages must equal 100%
- Individual ownership must be between 0-100%
- At least one beneficial owner required if UBOs exist
- 25% threshold for beneficial owner identification

### Directors Validation
- At least one director required if no beneficial owners
- Directors have 0% ownership percentage
- Must have defined roles (CEO, CFO, etc.)

### Flow Logic
```typescript
// Determine which flow to show
const shouldShowUBO = () => {
  return (flowParams.kybComplete || flowParams.kybRequirementComplete) 
         && !flowParams.uboRequirementComplete;
};

const shouldShowDirectors = () => {
  return !flowParams.ubosFound && flowParams.directorsFound;
};
```

## User Interface Specifications

### Modal System
- All flows use consistent modal overlay
- Standard dimensions and positioning
- Close button returns to dashboard
- Back button for navigation between steps

### Progress Indicators
- Vertical stepper on introduction page
- Horizontal stepper on success page
- Clear active/completed states
- Step labels appropriate to flow type

### Form Validation
- Real-time percentage validation
- Visual error states with clear messaging
- Disabled states for invalid forms
- Success feedback for valid inputs

### Responsive Design
- Mobile-friendly layouts
- Touch-friendly interaction areas
- Readable typography at all sizes
- Accessible color contrast

## Integration Points

### Government Data Simulation
Mock integration with business registries:
```typescript
const mockCompanyData = {
  companyName: "Cactus Practice LLC",
  beneficialOwners: [
    { id: "owner_1", name: "Tony Stark", percentage: 45, ownershipType: "direct" },
    { id: "owner_2", name: "Peper Pots", percentage: 35, ownershipType: "direct" },
    { id: "owner_3", name: "Peter Parker", percentage: 20, ownershipType: "indirect" }
  ]
};
```

### Document Management
- File upload interface for supporting documents
- Document type validation
- Review status tracking
- Download/preview capabilities

### Email Integration
- Verification completion notifications
- Status update emails
- Dashboard deep-linking from emails

## Error Handling

### Validation Errors
- Percentage validation (must total 100%)
- Required field validation
- Format validation for names/roles

### System Errors
- Network error handling
- Graceful degradation for missing data
- User-friendly error messages
- Recovery options

### Edge Cases
- Empty ownership lists
- Data synchronization issues
- Navigation interruption handling
- Session timeout management

## Testing Requirements

### Unit Tests
- Business logic validation
- State management functions
- Component rendering
- User interaction handling

### Integration Tests
- Complete user flows
- State persistence
- Navigation between components
- Error scenario handling

### User Acceptance Tests
- Complete verification flows
- Data accuracy validation
- Compliance requirement verification
- Accessibility compliance

## Performance Considerations

### Loading States
- Progressive data loading
- Skeleton states for forms
- Async validation feedback

### State Management
- Minimal re-renders
- Efficient context updates
- Memory leak prevention

### Bundle Optimization
- Code splitting by flow
- Lazy loading of components
- Asset optimization

## Security & Compliance

### Data Protection
- No persistent storage of sensitive data
- Session-based state management
- Secure data transmission

### Audit Trail
- Action logging for compliance
- Verification status tracking
- Change history maintenance

### Regulatory Compliance
- EU AML requirement adherence
- Data retention policies
- User consent management

## Deployment & Configuration

### Environment Variables
```
REACT_APP_API_BASE_URL=          # Backend API endpoint
REACT_APP_ENVIRONMENT=           # development/staging/production
REACT_APP_DOCUMENT_UPLOAD_URL=   # Document upload service
```

### Build Configuration
- TypeScript strict mode
- ESLint configuration
- Prettier code formatting
- Husky pre-commit hooks

### Production Considerations
- CDN asset delivery
- Browser compatibility (IE11+)
- Progressive web app features
- Analytics integration

## Future Enhancements

### Planned Features
- Multi-language support
- Advanced organizational charts
- Batch processing capabilities
- API integration with real government databases

### Scalability Considerations
- Microservices architecture readiness
- Database integration preparation
- Multi-tenant support planning
- Performance monitoring integration

---

This specification provides the complete technical and business requirements needed to implement a fully functional UBO verification system that meets EU regulatory compliance requirements while providing an excellent user experience.