# Frontend Design layout (basic wireframes )


## Application user flow

<img src="./1 - app_flow.png" alt="Project Screenshot" width="500">

`` For MVP keep ui only for the available features, no need to work on the other features shown on the ui below, just the MVP features for now.``

## Pages wireframe


### 1. Login page
<img src="./2 - Login_page.png" alt="Project Screenshot" width="500">

### 2. Register page
<img src="./2 - Register_page.png" alt="Project Screenshot" width="500">



### 3. Dashboard page

#### 3.1 Dashboard - mobile view
<img src="./3 - home-page-mobile.png" alt="Project Screenshot" width="500">

#### 3.2 Dashboard - web view
<img src="./3 - home-page-web.png" alt="Project Screenshot" width="500">



### 4. Add expense (drawer)
<img src="./4 - add_expense.png" alt="Project Screenshot" width="500">

A few design choices worth calling out:

- Amount is huge and front-and-center — it's the one field every single expense needs, so it gets the most visual weight, like a calculator display. Tapping it should bring up a numeric keypad on mobile.
- Category is a horizontal scrollable icon row, not a dropdown — one tap instead of open-menu-then-select. Faster for the most repeated action in the app. The selected one gets a colored ring so it's obvious at a glance.
- Date defaults to "Today" — most expenses are logged same-day, so don't make users pick a date every time. Tapping it opens a date picker only when needed.
- Note is optional and de-emphasized — placed last, small placeholder text, no pressure to fill it in.

- One practical tip: use the same Dialog/Drawer component conditionally — shadcn doesn't auto-switch between them, so you'd use a media query hook (useMediaQuery or Tailwind's md: breakpoint logic) to render Drawer under ~768px and Dialog above it, while sharing the same form component inside both.


### 5. Expenses list page (full page)
#### 5.1 Expenses list - mobile view
### 5.2 Expenses list - web view

### 6. Expense details page (not decided yet)
#### 6.1 Expense details - mobile view
#### 6.2 Expense details - web view

### 7. Edit expense page (not decided yet)
#### 7.1 Edit expense - mobile view
#### 7.2 Edit expense - web view

