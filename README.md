## 🔗 Demo Links

- 🎥 [Angular Demo](https://drive.google.com/file/d/1MR3IkSAFB9k8Cuk4J7k32YK31vuuplwi/view?usp=drive_link)  
- 🧹 [Demo Continue – Deleting Users](https://drive.google.com/file/d/1ZlEbiGAJHCXEbaTpYFT0V2f0WZ0E5_7J/view?usp=drive_link)

---

## ⚙️ Project Setup Steps

```bash
# 1. Clone the project
git clone https://github.com/magicprogramer/angular_fin.git

# 2. Backend setup
cd angular_fin/backend
npm install

# 3. Start backend server
# Make sure MongoDB is running and matches the connection string used in app.js:
# mongodb://localhost:27017/shop
node app.js

# 4. Open a new terminal for the Angular frontend
cd angular_fin
npm install --legacy-peer-deps

# 5. Start the Angular app
ng serve
```

---

## ⚠️ Important Notes

- By default, **there is no admin user**.
- To access the admin panel, either:
  - Modify the backend `/register` endpoint to create an admin user by default.
  - Or manually insert an admin user directly into your MongoDB database.

---

## 🐛 PrimeNG / Animations Bug

If you encounter an error related to `@angular/animations`, it may be caused by an unused PrimeNG dependency.  
You can safely remove it by running:

```bash
npm uninstall primeng
```

_I decided not to use PrimeNG in this project anyway._
