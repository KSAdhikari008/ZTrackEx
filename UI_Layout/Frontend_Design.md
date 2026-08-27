# Frontend Design layout (basic wireframes )
 
## component  structure

## Application user flow

<img src="./1 - App_flow.png" alt="Project Screenshot" width="500">

## Pages wireframe
### 1. Login page

<img src="./2 - Login_page.png" alt="Project Screenshot" width="500">

### 2. Register page

<img src="./2 - Register_page.png" alt="Project Screenshot" width="500">

### 3. Dashboard page

<img src="./3 - home-page-mobile.png" alt="Project Screenshot" width="500">
<img src="./3 - home-page-web.png" alt="Project Screenshot" width="500">

### 4. Add expense modal/drawer

<img src="./4 - Add_expense.png" alt="Project Screenshot" width="500">

A few design choices worth calling out:

- Amount is huge and front-and-center — it's the one field every single expense needs, so it gets the most visual weight, like a calculator display. Tapping it should bring up a numeric keypad on mobile.
- Category is a horizontal scrollable icon row, not a dropdown — one tap instead of open-menu-then-select. Faster for the most repeated action in the app. The selected one gets a colored ring so it's obvious at a glance.
- Date defaults to "Today" — most expenses are logged same-day, so don't make users pick a date every time. Tapping it opens a date picker only when needed.
- Note is optional and de-emphasized — placed last, small placeholder text, no pressure to fill it in.

- One practical tip: use the same Dialog/Drawer component conditionally — shadcn doesn't auto-switch between them, so you'd use a media query hook (useMediaQuery or Tailwind's md: breakpoint logic) to render Drawer under ~768px and Dialog above it, while sharing the same form component inside both.