# Tech choices (PERN) 

### Client State management: 
- Context API is enough for a project this size; probably don't need Redux.

### Server State management.
- Tanstack Query (previously know as react query) 

### Styling:
- Tailwind and plain Css
- Component lib - shadcn for componnents & ReCharts for charts. 
`` learn throught docs and tut on yt.``

###  Auth strategy: 
- JWT stored in httpOnly cookie (more secure) vs localStorage (simpler but XSS-vulnerable). Worth understanding the tradeoff.

### Validation:
- express-validator
- Validation in frontend , backend both

### Testing:
- Jest and Supertest