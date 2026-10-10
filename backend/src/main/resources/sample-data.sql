-- ===========================================================
-- Sample data: students & teams for local testing/demo
-- Run AFTER schema.sql (departments, categories, talents must exist)
-- ===========================================================

USE smart_talent_exposure;

-- Sample students (IT Department, Coding talent)
-- selected_talent_id 6 = 'Coding (Java, Python, etc.)' (1st technical talent, id offset depends on insert order)
-- Adjust the talent id below to match your actual auto-generated id from the talents table.

INSERT INTO students (register_number, mobile_number, name, email, department_id, year, selected_talent_id)
VALUES
('23B1T045', '9876543210', 'Tharan P',  'tharan.p23@drmgr.edu.in', 'it', 'III Year',
 (SELECT id FROM talents WHERE name = 'Coding (Java, Python, etc.)' LIMIT 1)),
('23B1T046', '9876543211', 'Kaviya R',  'kaviya.r23@drmgr.edu.in', 'it', 'II Year',
 (SELECT id FROM talents WHERE name = 'Coding (Java, Python, etc.)' LIMIT 1)),
('23B1T047', '9876543212', 'Dinesh V',  'dinesh.v23@drmgr.edu.in', 'it', 'II Year',
 (SELECT id FROM talents WHERE name = 'Coding (Java, Python, etc.)' LIMIT 1)),
('23B1T048', '9876543213', 'Harini S',  'harini.s23@drmgr.edu.in', 'it', 'III Year',
 (SELECT id FROM talents WHERE name = 'Coding (Java, Python, etc.)' LIMIT 1)),
('23B1T049', '9876543214', 'Vikram M',  'vikram.m23@drmgr.edu.in', 'it', 'II Year',
 (SELECT id FROM talents WHERE name = 'Coding (Java, Python, etc.)' LIMIT 1));

-- Create "Team Alpha" for the Coding talent, led by Tharan P
INSERT INTO teams (name, talent_id, leader_id, department_id)
VALUES (
    'Team Alpha',
    (SELECT id FROM talents WHERE name = 'Coding (Java, Python, etc.)' LIMIT 1),
    (SELECT id FROM students WHERE register_number = '23B1T045' LIMIT 1),
    'it'
);

-- Assign all 5 sample students to Team Alpha
UPDATE students
SET team_id = (SELECT id FROM teams WHERE name = 'Team Alpha' LIMIT 1)
WHERE register_number IN ('23B1T045', '23B1T046', '23B1T047', '23B1T048', '23B1T049');

-- ---------------------------------------------------------------
-- Login credentials for testing the app:
--   Register Number: 23B1T045
--   Mobile Number:   9876543210
-- (this student already has department + talent selected,
--  so the app will route directly to "My Team")
-- ---------------------------------------------------------------
