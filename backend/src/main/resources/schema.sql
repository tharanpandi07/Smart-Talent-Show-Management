-- ===========================================================
-- Smart Talent Exposure - Database Schema & Seed Data
-- Run this once to create the database, or let Hibernate
-- auto-create tables (ddl-auto=update) and use only the
-- INSERT statements below to seed reference data.
-- ===========================================================

CREATE DATABASE IF NOT EXISTS smart_talent_exposure
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE smart_talent_exposure;

-- -----------------------------------------------------------
-- Table: departments
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id          VARCHAR(20)  PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    icon        VARCHAR(10)
);

INSERT INTO departments (id, name, icon) VALUES
('it',    'Information Technology (IT)',        '💻'),
('cse',   'Computer Science (CSE)',              '🖥️'),
('ece',   'Electronics & Communication (ECE)',   '📡'),
('eee',   'Electrical & Electronics (EEE)',      '⚡'),
('mech',  'Mechanical Engineering (MECH)',       '⚙️'),
('civil', 'Civil Engineering (CIVIL)',           '🏛️'),
('aids',  'Artificial Intelligence (AI & DS)',   '🤖')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- -----------------------------------------------------------
-- Table: talent_categories
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS talent_categories (
    id          VARCHAR(20)  PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    emoji       VARCHAR(10),
    event_count INT DEFAULT 0
);

INSERT INTO talent_categories (id, name, emoji, event_count) VALUES
('arts',          'Arts & Culture',     '🎭', 128),
('technical',     'Technical / IT',     '💻', 156),
('sports',        'Sports & Fitness',   '🏅', 210),
('communication', 'Communication',      '🎤', 82),
('creative',      'Creative',           '🧠', 95)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- -----------------------------------------------------------
-- Table: talents (sub-talents under each category)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS talents (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id  VARCHAR(20) NOT NULL,
    name         VARCHAR(100) NOT NULL,
    icon         VARCHAR(20),
    FOREIGN KEY (category_id) REFERENCES talent_categories(id)
);

-- 🎭 Arts & Culture
INSERT INTO talents (category_id, name, icon) VALUES
('arts', 'Dance', 'music'),
('arts', 'Singing', 'mic'),
('arts', 'Music (Instrument)', 'music2'),
('arts', 'Acting', 'drama'),
('arts', 'Drawing / Painting', 'palette');

-- 💻 Technical / IT
INSERT INTO talents (category_id, name, icon) VALUES
('technical', 'Coding (Java, Python, etc.)', 'code'),
('technical', 'Web Development', 'globe'),
('technical', 'App Development', 'smartphone'),
('technical', 'DSA / Problem Solving', 'cpu'),
('technical', 'UI/UX Design', 'palette');

-- 🏅 Sports & Fitness
INSERT INTO talents (category_id, name, icon) VALUES
('sports', 'Kabaddi', 'sport'),
('sports', 'Basketball', 'sport'),
('sports', 'Cricket', 'sport'),
('sports', 'Football', 'sport'),
('sports', 'Athletics', 'sport'),
('sports', 'Gym / Fitness', 'sport');

-- 🎤 Communication
INSERT INTO talents (category_id, name, icon) VALUES
('communication', 'Public Speaking', 'mic'),
('communication', 'Storytelling', 'book'),
('communication', 'Anchoring (Host)', 'mic2');

-- 🧠 Creative
INSERT INTO talents (category_id, name, icon) VALUES
('creative', 'Photography', 'camera'),
('creative', 'Video Editing', 'video'),
('creative', 'Content Creation', 'smartphone'),
('creative', 'Meme Creation', 'smile');

-- -----------------------------------------------------------
-- Table: students
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    register_number VARCHAR(20)  UNIQUE NOT NULL,
    mobile_number   VARCHAR(15)  NOT NULL,
    name            VARCHAR(100),
    email           VARCHAR(100),
    department_id   VARCHAR(20),
    year            VARCHAR(20),
    selected_talent_id BIGINT,
    team_id         BIGINT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (selected_talent_id) REFERENCES talents(id)
);

-- -----------------------------------------------------------
-- Table: teams
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS teams (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    talent_id    BIGINT NOT NULL,
    leader_id    BIGINT,
    department_id VARCHAR(20),
    FOREIGN KEY (talent_id) REFERENCES talents(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- -----------------------------------------------------------
-- Table: events
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    title             VARCHAR(150) NOT NULL,
    subtitle          VARCHAR(150),
    category_id       VARCHAR(20),
    department_id     VARCHAR(20),
    event_date        DATE NOT NULL,
    start_time        TIME,
    end_time          TIME,
    venue             VARCHAR(150),
    eligibility       VARCHAR(150),
    description       TEXT,
    team_size         VARCHAR(50),
    registration_deadline DATETIME,
    FOREIGN KEY (category_id) REFERENCES talent_categories(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

INSERT INTO events
(title, subtitle, category_id, department_id, event_date, start_time, end_time, venue, eligibility, description, team_size, registration_deadline)
VALUES
('CodeStorm 2025', 'Coding Competition', 'technical', 'it', '2025-06-15', '10:00:00', '14:00:00',
 'IT Lab, Block A', 'IT Department Students Only',
 'Show your coding skills and solve real-world problems.', '1 - 2 Members', '2025-06-10 23:59:00'),
('UI/UX Design Challenge', NULL, 'technical', 'it', '2025-06-22', '09:00:00', '13:00:00',
 'Design Studio, Block B', 'IT Department Students Only',
 'Design an intuitive interface for a real-world app brief.', '1 Member', '2025-06-18 23:59:00'),
('AI Workshop', NULL, 'technical', 'it', '2025-07-05', '14:00:00', '17:00:00',
 'Seminar Hall', 'IT Department Students Only',
 'Hands-on workshop on AI & Machine Learning fundamentals.', 'Individual', '2025-07-01 23:59:00');

-- -----------------------------------------------------------
-- Table: event_registrations
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_registrations (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id    BIGINT NOT NULL,
    student_id  BIGINT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_event_student (event_id, student_id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE event_participation_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(300),
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);