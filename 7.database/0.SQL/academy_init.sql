PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS professors;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
  dept_id TEXT PRIMARY KEY,
  dept_name TEXT NOT NULL
);

CREATE TABLE students (
  student_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 4),
  dept_id TEXT NOT NULL,
  entered_at TEXT,
  FOREIGN KEY(dept_id) REFERENCES departments(dept_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE professors (
  professor_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  dept_id TEXT NOT NULL,
  tenure_years INTEGER DEFAULT 0,
  FOREIGN KEY(dept_id) REFERENCES departments(dept_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE courses (
  course_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  dept_id TEXT NOT NULL,
  professor_id TEXT NOT NULL,
  credits INTEGER NOT NULL CHECK (credits IN (1,2,3)),
  semester TEXT NOT NULL,
  FOREIGN KEY(dept_id) REFERENCES departments(dept_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY(professor_id) REFERENCES professors(professor_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE enrollments (
  enroll_id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  enrolled_at TEXT,
  status TEXT NOT NULL DEFAULT 'ENROLLED' CHECK (status IN ('ENROLLED','DROPPED')),
  FOREIGN KEY(student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(course_id) REFERENCES courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE grades (
  grade_id TEXT PRIMARY KEY,
  enroll_id TEXT NOT NULL,
  score REAL NOT NULL CHECK (score BETWEEN 0 AND 100),
  letter TEXT NOT NULL CHECK (letter IN ('A','B','C','D','F')),
  FOREIGN KEY(enroll_id) REFERENCES enrollments(enroll_id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO departments VALUES
('D01','Computer Science'),
('D02','Business'),
('D03','Design');

INSERT INTO students VALUES
('ST001','Kim',1,'D01','2025-03-02'),
('ST002','Lee',2,'D01','2024-03-02'),
('ST003','Park',3,'D02','2023-03-02'),
('ST004','Choi',4,'D02','2022-03-02'),
('ST005','Jung',2,'D03','2024-03-02'),
('ST006','Oh',1,'D03','2025-03-02'),
('ST007','Han',3,'D01','2023-03-02');

INSERT INTO professors VALUES
('PR001','Prof.Ahn','D01',8),
('PR002','Prof.Bae','D01',3),
('PR003','Prof.Kim','D02',10),
('PR004','Prof.Lee','D03',5),
('PR005','Prof.Park','D01',1);

INSERT INTO courses VALUES
('CS101','Intro to Programming','D01','PR002',3,'2025-Fall'),
('CS201','Databases','D01','PR001',3,'2025-Fall'),
('CS301','AI Basics','D01','PR001',3,'2025-Fall'),
('CS210','Computer Networks','D01','PR005',3,'2025-Fall'),
('BA101','Accounting','D02','PR003',3,'2025-Fall'),
('BA205','Marketing','D02','PR003',3,'2025-Fall'),
('DS110','Design Thinking','D03','PR004',2,'2025-Fall'),
('DS210','UX Research','D03','PR004',2,'2025-Fall');

INSERT INTO enrollments VALUES
('E001','ST001','CS101','2025-09-01','ENROLLED'),
('E002','ST001','CS201','2025-09-01','ENROLLED'),
('E003','ST002','CS201','2025-09-01','ENROLLED'),
('E004','ST002','CS301','2025-09-01','ENROLLED'),
('E005','ST003','BA101','2025-09-01','ENROLLED'),
('E006','ST003','BA205','2025-09-01','ENROLLED'),
('E007','ST004','BA205','2025-09-01','ENROLLED'),
('E008','ST005','DS110','2025-09-01','ENROLLED'),
('E009','ST005','CS101','2025-09-02','DROPPED'),
('E010','ST006','DS210','2025-09-01','ENROLLED'),
('E011','ST007','CS201','2025-09-01','ENROLLED'),
('E012','ST007','CS210','2025-09-01','ENROLLED');

INSERT INTO grades VALUES
('G001','E001',92,'A'),
('G002','E002',81,'B'),
('G003','E003',77,'C'),
('G004','E004',88,'B'),
('G005','E005',69,'D'),
('G006','E006',74,'C'),
('G007','E007',90,'A'),
('G008','E008',85,'B'),
('G009','E010',95,'A'),
('G010','E011',66,'D'),
('G011','E012',79,'C');
