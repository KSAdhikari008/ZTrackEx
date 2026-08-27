# Tech choices (MERN) 

### State management: 
- Context API is enough for a project this size; you probably don't need Redux.
 
### Styling:
- Tailwind and plain Css
- Component lib - shadcn for componnents & rechart for charts. 
`` learn throught docs and tut on yt.``

###  Auth strategy: 
- JWT stored in httpOnly cookie (more secure) vs localStorage (simpler but XSS-vulnerable). Worth understanding the tradeoff.

### Validation:
- Validation in frontend , backend both
- express-validator

### Testing:
- Jest for backend