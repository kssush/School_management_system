<div style="display: flex; gap: 20px; margin-bottom: 25px">
    <span style="background-color: #EFD4FF; color: #1F1F1F; padding: 6px 15px; border-radius: 10px; font-weight: bold">React</span>
    <span style="background-color: #FFF3D1; color: #1F1F1F; padding: 6px 15px; border-radius: 10px; font-weight: bold">Node.js</span>
    <span style="background-color: #D7ECDD; color: #1F1F1F; padding: 6px 15px; border-radius: 10px; font-weight: bold">PostgresSQL</span>
    <span style="background-color: #FEE3C5; color: #1F1F1F; padding: 6px 15px; border-radius: 10px; font-weight: bold">RTK Query</span>
    <span style="background-color: #E7D3DE; color: #1F1F1F; padding: 6px 15px; border-radius: 10px; font-weight: bold">Figma</span>
</div>

<br>

# School management system

### A platform for modern educational institutions that provides:

<ul style="list-style-type: disc; padding: 0;">
    <li style="margin-bottom: 5px; margin-left: 40px">For administrators: monitoring staff and student accounts, academic year progress, and predictive analytics to support student academic achievement.</li>
    <li style="margin-bottom: 5px; margin-left: 40px">For teachers: effective tools for lesson planning, assignment allocation, and grading.</li>
    <li style="margin-bottom: 5px; margin-left: 40px">For students and parents: a portal for viewing assignments, tracking grades, and monitoring progress.</li>
    <li style="margin-left: 40px">For all participants of the system, view class schedules and teachers of their profiles.</li>
</ul>

<br>

> ___
> ### 🎨 UI/UX Design
> #### View Design System: [the design is here](https://www.figma.com/design/0jdj2HodbmmhJnwUH5dcvf/School-Edu-TEMP?m=auto&t=X0E3XNeBCIzMB5ZD-6)
> ___

<br><br>

# 🚀 Installation Steps

### Clone repository
```bash
git clone https://github.com/kssush/School_management_system.git
cd school_management_system
```

### Install dependencies
```bash
cd server
npm install

cd client
npm install
```

### Database setup
- Create a new database in PostgreSQL named SchoolMS (example)

### Environment configuration
- Create .env file in the server folder with:
```bash
PORT=5000
DB_NAME=SchoolMS                 //name your db
DB_USER=postgres
DB_PASSWORD=passwd               //password your db
DB_HOST=localhost
DB_PORT=0000                     //port your db
SECRET_KEY=random_key            
JWT_ACCESS_SECRET_KEY=yourjwt    
JWT_REFRESH_SECRET_KEY=yourjwt   
```

### Run the application
```bash
cd server
npm run dev

cd client
npm start
```

<br>

# 🐛 Known Issues
- add a mobile version + responsive (layout in rem units, write media queries for different screen sizes)
- add preloaders and smooth animations
- handle more unique errors on the server (currently handling custom exceptions, with a common handler for others)  


<br>

## 📄 License
This project is licensed under the MIT License - see the LICENSE.md file for details.


## 👥 Author (kssush)
### Telegram: @Stasi4ekKk
