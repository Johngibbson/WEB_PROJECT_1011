# Pawfect Match: Pet Adoption Portal

A frontend-only Pet Adoption Portal built with **HTML5, CSS3, JavaScript (ES6+) and React** for a Web Technology college project.
Visitors can browse pets, view detailed profiles, save favourites and send adoption requests. A demo admin panel approves or rejects those requests.

---

## 1. Objectives
- Practise React fundamentals: components, props, state, hooks, routing and context.
- Build a complete, accessible, responsive website with no backend.
- Focus on two main features: **Pet Profiles** and **Adoption Requests**.

## 2. Features
| Area | What it does |
|---|---|
| Home | Hero banner, 4 featured pets, 3-step process, live statistics with count-up animation, testimonials |
| Available Pets | Debounced search (name/breed), filters (type, age group, gender, status), sorting, filters saved in the URL, filter chips, "Clear all", results count, "Load more" (8 per page), empty state |
| Pet Details | Photo gallery, facts, health checklist, personality tags, care needs, favourite, share/copy link, status-aware adopt button, related pets, "Pet not found" page |
| Adoption Form | Full validation (on blur and on submit), focus moves to the first error, live character counter, duplicate check, double-click protection, unique ID `ADP-YYYYMMDD-XXXX`, success screen with copy-ID button, warning before closing a half-filled form |
| My Requests | Responsive table (cards on mobile), search, status filter, date sort, accessible details modal with status history, cancel with confirmation |
| Admin (demo) | Summary cards, approve / reject, search and filter, CSV export, reset demo data |
| About / Contact | Mission, how it works, responsible-adoption checklist, FAQ accordion, validated contact form (saved in localStorage) |
| General | Sticky navbar, working hamburger menu, favourites badge, toasts, back-to-top button, 404 page, error boundary, keyboard and screen-reader friendly |

### Pet status rules
- A new request makes the pet **Pending**, so nobody else can apply for it.
- **Approve**: the request becomes Approved, the pet becomes **Adopted**, and any other pending requests for that pet become Rejected.
- **Reject** or **Cancel**: the pet goes back to **Available** if it has no other pending request.
- **Design choice:** cancelled requests are **kept** with the status "Cancelled" instead of being deleted, so their history stays visible.

## 3. Technologies
- React 18 (functional components and hooks only)
- React Router DOM v6 (`HashRouter`)
- Vite 5 (dev server and build tool)
- Plain CSS with CSS variables (one file: `src/styles/style.css`)
- Browser `localStorage` for saving data

No TypeScript, Tailwind, Bootstrap, UI libraries, Redux, backend or paid APIs are used.

## 4. Setup
Requires Node.js 18 or newer.

```bash
cd pet-adoption-portal
npm install
npm run dev        # open the URL it prints, usually http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

**If you started from `npm create vite@latest`:** delete `src/App.css`, `src/index.css`, `src/assets/`, `public/vite.svg` and `eslint.config.js` (optional), replace `index.html`, `package.json`, `vite.config.js`, `src/main.jsx` and `src/App.jsx` with the files in this project, then copy in the remaining folders.

## 5. Folder structure
```text
pet-adoption-portal/
├── public/images/placeholder.svg   Fallback image used when a photo link breaks
├── src/
│   ├── components/   Reusable UI pieces (PetCard, Modal, AdoptionForm, ...)
│   ├── pages/        One component per route (HomePage, PetsPage, ...)
│   ├── context/AppContext.jsx   Shared state: pets, requests, favourites, toasts
│   ├── hooks/useLocalStorage.js useState + automatic localStorage saving
│   ├── hooks/usePageTitle.js    Sets the browser tab title
│   ├── utils/validators.js      Pure form-validation functions
│   ├── utils/helpers.js         ID generator, date/age formatting, filtering, sorting, CSV
│   ├── data/pets.js             12 sample pets
│   ├── data/testimonials.js     Sample testimonials
│   ├── styles/style.css         All styles (mobile-first)
│   ├── App.jsx                  Layout and routes
│   └── main.jsx                 Entry point (HashRouter + AppProvider)
├── index.html
├── vite.config.js
└── package.json
```

Page files have a `Page` suffix (for example `pages/AdminPage.jsx`) so they do not share a name with components such as `components/AdminDashboard.jsx`.

### Routes
`/` Home · `/pets` Pets · `/pets/:id` Details · `/adopt/:id` Adoption form · `/requests` My requests · `/admin` Admin · `/about` · `/contact` · `/favorites` · `*` 404.
Because the app uses `HashRouter`, real URLs look like `http://localhost:5173/#/pets?type=Dog`.

## 6. Limitations
- **No real backend, login or email.** Everything runs in the browser.
- **localStorage is per browser and per device.** Requests made in Chrome are not visible in Firefox or on another phone, and clearing browser data removes them.
- "My Requests" shows every request sent from this browser, since there are no user accounts.
- The admin panel is **not secure**: anyone can open `/#/admin`.
- Pet photos are stored inside the project (`public/images/pets/`), so they work offline. If a photo file is missing, a local placeholder is shown instead.
- The "leave page" warning only appears when closing or refreshing the tab, not when clicking links inside the app.

## 7. Future improvements
- A real backend (Node.js + Express or Firebase) with a database for pets and requests.
- User accounts and a secure admin login with roles.
- Email/SMS notifications when a request status changes.
- Photo uploads for shelters and an "add/edit pet" form in the admin panel.
- Booking a meet-and-greet slot, and a map of pet locations.

---

## 8. Manual test checklist
| # | Test | Expected result |
|---|---|---|
| 1 | Open Home | 4 featured Available pets, stats count up (8 pets available) |
| 2 | Click "Explore Pets" / "How Adoption Works" | Page scrolls smoothly to that section |
| 3 | Pets page: type "lab" in search | After a short pause only Bruno shows and the URL contains `q=lab` |
| 4 | Choose Type = Dog, Status = Available, then refresh | Filters, chips and results stay the same |
| 5 | Search "zzz" | Empty state appears; "Reset filters" shows all 12 pets |
| 6 | Sort "Age (youngest first)" | Simba (3 months) is first |
| 7 | Click a heart, refresh, open Favourites | Pet is still saved and the navbar badge shows 1 |
| 8 | Open a Pending/Adopted pet | Button reads "Request Pending" / "Already Adopted" and is disabled |
| 9 | Visit `/#/adopt/3` directly | "Can't be adopted right now" message, not the form |
| 10 | Submit an empty adoption form | Error under every field and focus jumps to "Full name" |
| 11 | Enter phone `12345`, name `Jo`, short reason | Specific error messages and a live character counter |
| 12 | Submit a valid form (phone `+91 98765 43210`) | Success screen with an `ADP-YYYYMMDD-XXXX` ID; Copy ID works; pet becomes Pending |
| 13 | Same email, same pet again (e.g. after the admin rejects, re-apply, then try a second time) | "You have already sent a request" message |
| 14 | My Requests: View details, then press Esc | Modal opens with all fields and history; Esc / outside click closes it |
| 15 | Cancel a Pending request | Confirmation dialog appears; status becomes Cancelled; pet is Available again |
| 16 | Admin: Approve a request | Request Approved, pet Adopted, Home stats increase |
| 17 | Admin: Reject a request | Request Rejected, pet Available again |
| 18 | Admin: Reset demo data | After confirming, pets are restored and requests cleared |
| 19 | Visit `/#/pets/999` and `/#/abc` | Friendly "Pet not found" and 404 pages |
| 20 | Phone width (DevTools, 375px) | Hamburger menu works, requests show as cards, no sideways scrolling |
| 21 | DevTools → Application → set `pap-pets` to `{bad` and refresh | App still loads with the sample pets |

---

## 9. Viva cheat-sheet

**1. What is React?**
A JavaScript library for building user interfaces from reusable **components**. React keeps a virtual copy of the page and updates only the parts of the real DOM that changed.

**2. Props vs state?**
**Props** are inputs passed from a parent to a child and are read-only (e.g. `PetCard` receives `pet`, `isFavorite`, `onToggleFavorite`). **State** is data a component owns and can change with a setter (e.g. `values` in `AdoptionForm`). Changing state re-renders the component.

**3. Why hooks?**
Hooks let function components have state and side effects without classes. I used `useState`, `useEffect`, `useMemo`, `useRef`, `useContext`, `useId` and router hooks (`useParams`, `useSearchParams`, `useLocation`). Navigation uses `<Link>`/`<NavLink>`; `useNavigate` would be used to change page from code (e.g. after a timer). I also wrote custom hooks: `useLocalStorage` and `usePageTitle`.

**4. What does `useEffect` do here?**
It runs code after rendering: saving to localStorage whenever data changes, the 250 ms search debounce timer, closing the menu on route change, scrolling to top, the count-up animation, the modal's Esc/focus-trap listeners, and the "leave page" warning. Cleanup functions remove timers and listeners.

**5. How does routing work?**
`HashRouter` in `main.jsx` and `<Routes>/<Route>` in `App.jsx` map URLs to page components. `NavLink` highlights the active page. `useParams` reads `:id` from `/pets/:id`. A `*` route catches unknown URLs. Hash routing (`/#/pets`) means the server always serves `index.html`, so refresh never gives a 404.

**6. How does localStorage persistence work?**
`useLocalStorage(key, initialValue)` reads the saved JSON once when the app starts (inside `try/catch`). If the data is missing or corrupted it uses the initial value, so the sample pets are "seeded" on the first visit. A `useEffect` writes the value back with `JSON.stringify` every time it changes.

**7. How is validation done?**
`utils/validators.js` has small pure functions (`validateName`, `validateEmail`, `validatePhone` ...) that return an error message or `''`. The form validates a field on blur, re-validates while typing once a field has been visited, and validates everything on submit. Errors are linked to inputs with `aria-describedby`, and focus moves to the first invalid field. The phone number is normalised (spaces and `+91` removed) and must match `/^[6-9]\d{9}$/`.

**8. Why Context?**
Pets, requests and favourites are needed on many pages. `AppContext` provides them once at the top, so pages call `useAppContext()` instead of passing props down through many levels (prop drilling). It also keeps pet status and request status in sync in one place.

**9. How does filtering work?**
Filter values live in the URL query string (`useSearchParams`). `filterPets()` keeps the pets that match every active filter, `sortPets()` sorts a copy, and `useMemo` caches the result until the pets or URL change. The search box updates the URL 250 ms after typing stops (debouncing).

**10. How do you prevent double submission and duplicate requests?**
A `useRef` flag blocks a second click instantly and the button is disabled while submitting. The context checks for an existing Pending/Approved request with the same pet and email (case-insensitive), and the pet becomes Pending so others cannot apply.

**11. What is an Error Boundary?**
A component that catches rendering errors in its children and shows a fallback page instead of a blank screen. React only supports these as class components, so it is the one class in the project.

**12. How would you add a real backend?**
Create a REST API (Node.js + Express + MongoDB, or Firebase) with endpoints such as `GET /pets`, `POST /requests` and `PATCH /requests/:id`. Replace the localStorage functions in `AppContext` with `fetch` calls, add loading/error states, and add login (JWT) so only admins can approve requests. Validation would also run on the server.

---

## 10. Photo credits
All photos come from [Wikimedia Commons](https://commons.wikimedia.org) under free licences, stored in `public/images/pets/`. The people in the stories are fictional, and the photos are used only to illustrate them.

| File | Photo | Author | Licence |
|---|---|---|---|
| bruno.jpg | [Portrait of a labrador retriever](https://commons.wikimedia.org/wiki/File:Portrait_of_a_labrador_retriever.jpg) | Dktue | CC0 |
| daisy.jpg | [Indian pariah dog puppy litter](https://commons.wikimedia.org/wiki/File:Indian_pariah_dog_puppy_litter.jpg) | Wasir kasab | CC BY 4.0 |
| rocky.jpg | [German Shepherd Dog](https://commons.wikimedia.org/wiki/File:20110425_German_Shepherd_Dog_8505.jpg) | Jakub Hałun | CC BY-SA 4.0 |
| muffin.jpg | [Beagle portrait Camry](https://commons.wikimedia.org/wiki/File:Beagle_portrait_Camry.jpg) | Ruth Ellison | CC BY 2.0 |
| luna.jpg | [June odd-eyed cat](https://commons.wikimedia.org/wiki/File:June_odd-eyed-cat_cropped.jpg) | Keith Kissel | CC BY 2.0 |
| simba.jpg | [Ginger Kitten](https://commons.wikimedia.org/wiki/File:Ginger_Kitten.jpg) | Prosthetic Head | CC BY-SA 4.0 |
| cleo.jpg | [Siamese cat, female](https://commons.wikimedia.org/wiki/File:Siamese_cat,_female.jpg) | Felinlove | CC BY-SA 4.0 |
| snowy.jpg | [A grey holland lop rabbit](https://commons.wikimedia.org/wiki/File:A_grey_holland_lop_rabbit.jpg) | Kippo44 | CC BY-SA 4.0 |
| coco.jpg | [Dutch rabbit](https://commons.wikimedia.org/wiki/File:Dutch_rabbit.jpg) | Sahrazad (Czech Wikipedia) | Public domain |
| mithu.jpg | [Aratinga solstitialis, Loro Parque](https://commons.wikimedia.org/wiki/File:Aratinga_solstitialis_-_Loro_Parque_01.jpg) | H. Zell | CC BY-SA 3.0 |
| peanut.jpg | [Baby Hamster, 2 Weeks Old](https://commons.wikimedia.org/wiki/File:Baby_Hamster_-_2_Weeks_Old.jpg) | Augustus Binu | CC BY-SA 3.0 |
| shelly.jpg | [Red-eared slider basking, Penang](https://commons.wikimedia.org/wiki/File:Penang_-_red-eared_slider_basking_at_Burmese_Temple_-_May_2024.jpg) | Dominic Nelson | CC BY-SA 4.0 |
| hero.jpg | [Dogs in Berlin-Karow](https://commons.wikimedia.org/wiki/File:2017-07-06_Hunde_Berlin-Karow_08.jpg) | Meine Mutter | CC BY-SA 4.0 |

## 11. How to deploy
- **Netlify / Vercel:** import the project, use build command `npm run build` and output folder `dist`. Or drag the `dist` folder into Netlify Drop.
- **GitHub Pages:** run `npm run build`, push the contents of `dist` to a `gh-pages` branch (or use the `gh-pages` npm package), then enable Pages for that branch.
- `vite.config.js` uses `base: './'` and the app uses `HashRouter`, so it works in a sub-folder and refreshing never gives a 404.
