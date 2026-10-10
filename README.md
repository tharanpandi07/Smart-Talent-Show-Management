# Smart Talent Exposure — Student Flow (IT Department Only)

Full-stack implementation: **Java 17 + Spring Boot 3** (REST API) · **MySQL** · **React 18 + Vite** (frontend).

## Corrected Talent Categories

| Category | Talents |
|---|---|
| 🎭 Arts & Culture | Dance, Singing, Music (Instrument), Acting, Drawing / Painting |
| 💻 Technical / IT | Coding (Java, Python, etc.), Web Development, App Development, DSA / Problem Solving, UI/UX Design |
| 🏅 Sports & Fitness | Kabaddi, Basketball, Cricket, Football, Athletics, Gym / Fitness |
| 🎤 Communication | Public Speaking, Storytelling, Anchoring (Host) |
| 🧠 Creative | Photography, Video Editing, Content Creation, Meme Creation |

## Project Structure

```
smart-talent/
├── backend/                  # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/dmgr/talent/
│       │   ├── SmartTalentExposureApplication.java
│       │   ├── model/        # JPA entities
│       │   ├── repository/   # Spring Data JPA repos
│       │   ├── dto/           # Request/response DTOs
│       │   ├── controller/    # REST controllers (1 per screen group)
│       │   └── config/        # CORS config
│       └── resources/
│           ├── application.properties
│           ├── schema.sql      # tables + categories/talents/events seed
│           └── sample-data.sql # demo students/team
└── frontend/                  # React + Vite SPA
    └── src/
        ├── api/client.js       # axios API wrapper
        ├── components/Shared.jsx
        ├── pages/               # 1 page per screen
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

## Backend Setup

1. **Create the database** — run `schema.sql` in MySQL Workbench / CLI:
   ```bash
   mysql -u root -p < src/main/resources/schema.sql
   mysql -u root -p < src/main/resources/sample-data.sql
   ```

2. **Configure credentials** in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```

3. **Run the API**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   API available at `http://localhost:8080/api`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
App available at `http://localhost:5173`. Vite proxies `/api` calls to `http://localhost:8080`.

## Test Login

```
Register Number: 23B1T045
Mobile Number:   9876543210
```
This sample student already has department (IT) and talent (Coding) set, so the app routes
straight to **My Team**, where you'll see "Team Alpha" with 5 IT-department members.

To test screens 2–4 (Department → Category → Talent), insert a new student row in `students`
with `department_id = NULL` and `selected_talent_id = NULL`, then log in with that
register/mobile number.

## API Endpoints

| Screen | Method & Path |
|---|---|
| 1. Login | `POST /api/auth/login` |
| 2. Department Selection | `GET /api/departments`, `POST /api/departments/select/{studentId}` |
| 3. Talent Category | `GET /api/categories` |
| 4. Choose Your Talent | `GET /api/talents?categoryId=technical`, `POST /api/talents/select/{studentId}` |
| 5. My Team | `GET /api/teams/my/{studentId}` |
| 6. Upcoming Events | `GET /api/events?departmentId=it` |
| 7. Event Details | `GET /api/events/{id}?studentId={id}`, `POST /api/events/{id}/register` |
| 8. My Profile | `GET /api/profile/{studentId}` |
