Backend
----------
1. init -y
2. express 
3. dotenv 
4. mongoose
5. jwt
6. bcryptjs 
7. nodemon
8. cookie-parser 
9. async-handler 
10. multer
11. passport
12. passport-google-oauth20
13. express-session

Async Handler allows you to write asynchronous route handlers 
without having to manually wrap them in try-catch blocks 
to catch and pass errors to the Express error-handling middleware.


Frontend
--------
1. vite@latest 
2. reduxjs/toolkit
3. react-redux
4. react-router-dom 
5. react-icons 
6. Formik 
7. Yup 
8. react-toastify
9. react-oauth/google

### For start both frontend and Backend
```bash
npm install -D concurrently
npm start dev
```

If you face any problems during the programme run. 
  You should remove 'node_modules' and 'package-lock.json', then reinstall.
```bash
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```
### you can reinstall your dependencies with:
```bash
npm install
```


