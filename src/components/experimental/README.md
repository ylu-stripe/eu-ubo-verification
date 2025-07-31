# Experimental Confirm & Edit Pages

This is a fork of the main confirm and edit page components for experimentation purposes.

## Files Included:
- `ConfirmPage.tsx` - Forked from `src/components/flows/ubo/ConfirmPage.tsx`
- `EditPage.tsx` - Forked from `src/components/flows/ubo/EditPage.tsx`
- `Modal.tsx` - Forked from `src/components/ui/Modal.tsx`
- `mockData.ts` - Essential types and sample data for testing
- `Demo.tsx` - Interactive demo to test all component variations

## Usage:

### Quick Start
```tsx
import Demo from './components/experimental/Demo';

// Use the Demo component to test all variations
<Demo />
```

### Individual Components

#### ConfirmPage
```tsx
import ConfirmPage from './ConfirmPage';
import { mockCompanyData } from './mockData';

// UBO confirmation page
<ConfirmPage 
  isDirectorsFlow={false} 
  initialData={mockCompanyData.beneficialOwners}
/>

// Directors confirmation page
<ConfirmPage 
  isDirectorsFlow={true} 
  initialData={mockCompanyData.directors}
/>
```

#### EditPage
```tsx
import EditPage from './EditPage';
import { mockCompanyData } from './mockData';

// UBO edit page
<EditPage 
  isDirectorsFlow={false} 
  initialData={mockCompanyData.beneficialOwners}
  onSave={(items) => console.log('Saved:', items)}
/>

// Directors edit page  
<EditPage 
  isDirectorsFlow={true} 
  initialData={mockCompanyData.directors}
  onSave={(items) => console.log('Saved:', items)}
/>

// Empty UBO page (for "no + no" flow)
<EditPage 
  isDirectorsFlow={false} 
  initialData={[]}
  onSave={(items) => console.log('Saved:', items)}
/>
```

## Key Features:

### ConfirmPage
- ✅ UBO and Directors flow support
- ✅ Mock data display
- ✅ Console logging for interactions
- ✅ Responsive layout
- ✅ Validation messaging

### EditPage
- ✅ Add/Remove functionality
- ✅ Form validation (percentage totals for UBOs)
- ✅ Removed items with "Add back" option
- ✅ Directors vs UBOs differentiation
- ✅ Save callback support
- ❌ Complex animations (simplified for experimentation)
- ❌ Context integration (self-contained)

## Testing Scenarios:

1. **UBO Confirm Page** - Test with prefilled beneficial owners
2. **Directors Confirm Page** - Test with prefilled directors
3. **UBO Edit Page** - Test adding/removing beneficial owners with percentage validation
4. **Directors Edit Page** - Test adding/removing directors with roles
5. **Empty UBO Page** - Test "no + no" flow starting point

## Integration with Main App:

To integrate experimental changes back into the main application:
1. Copy desired changes from experimental components
2. Update the main components in `src/components/flows/ubo/`
3. Ensure context integration and navigation work correctly
4. Test with the full application flow

## Original Sources:
- Main application flows: `src/components/flows/`
- Original context: `src/contexts/UBOContext.tsx`
- Original styling: `src/App.css`

## Notes:
- These components use console.log for debugging instead of actual navigation
- CSS classes reference the main App.css file
- Components are self-contained and don't require the UBO context
- Perfect for isolated testing and experimentation 