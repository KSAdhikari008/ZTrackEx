
```
/server
  /config       (db connection, env setup)
  /constants    (categories.js for enum of categories)
  /models       (Mongoose schemas)
  /routes       (route definitions)
  /controllers  (business logic)
  /middleware   (auth, errorHandler.js)
  /utils
  server.js

/client
  /src
    /components
    /pages
    /context or /store  (state management)
    /services   (API calls, e.g. axios instance)
    /hooks
```

## Constants
** Since you're not using a monorepo-shared-constants setup necessarily. Instead of hardcoding the list on the frontend at all, expose a small endpoint:

GET /api/categories

...that just returns the array from your single backend constants file. Your React dropdown fetches this on mount instead of importing a local copy. Now there's truly only one source of truth (the backend file), and the frontend never has its own copy to go stale.

it's realistic practice for something you'll do constantly in real apps — the frontend asking the backend for reference/lookup data instead of hardcoding it. It also means if you ever move to the custom-user-categories v2 feature, this endpoint just evolves naturally into "return default + user's custom categories" instead of you having to rip out a hardcoded frontend array later. **

