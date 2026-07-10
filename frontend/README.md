# Smart Clinical Advisor

React + Tailwind CSS front end for the Smart Clinical Advisor UI (Create Patient + Results views).

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Structure

```
src/
  App.jsx                 - top-level state (current view, saved patient)
  components/
    Sidebar.jsx            - left nav
    Topbar.jsx              - search bar, notifications, doctor profile
    CreatePatient.jsx       - patient intake form + document uploads + vitals
    Results.jsx             - patient summary, input summary, prescription, AI query panel
    VitalCard.jsx           - reusable vitals card (Blood Pressure, Heart Rate, etc.)
    UploadCard.jsx          - reusable document upload tile
    BodyDiagram.jsx         - simplified body silhouette with a pin marker
    Placeholder.jsx         - stub for nav items not yet built out
  data/
    vitals.js               - vitals config + sample result data
```

## Notes

- Filling out the Create Patient form and clicking **Save** populates the Results view
  and navigates you there automatically.
- The body illustration is an original simplified silhouette (not a licensed anatomy image).
- Prescription, History, AI Analysis, and Help currently render a placeholder screen —
  wire in real data/components as needed.
