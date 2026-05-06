SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE internship_activity;
TRUNCATE TABLE activity_category;
TRUNCATE TABLE internship;
TRUNCATE TABLE person;
TRUNCATE TABLE activity;
TRUNCATE TABLE category;

INSERT INTO activity (id, title, visible) VALUES
  (1, 'Jeu de mémoire lumineux Ordo Lumina (Python)', 1),
  (2, 'Montage d\'un poste de travail PC', 1),
  (3, 'Installation d\'un système d\'exploitation (Ubuntu)', 1),
  (4, 'Réalisation d\'un site Web (HTML, CSS et PHP)', 1),
  (5, 'Programmation du jeu Casse-briques (Microsoft Small Basic)', 1),
  (6, 'Programmation du jeu Tetris (Microsoft Small Basic)', 1),
  (7, 'Programmation du jeu Attrape-moi (Processing)', 1),
  (8, 'Programmation du jeu Flappy Bird (Scratch)', 1),
  (9, 'Programmation du jeu Pac-Miam (Scratch)', 1),
  (10, 'Programmation d\'un robot Ozobot (OzobotEditor)', 1),
  (11, 'Création d\'une affiche de film (Gimp)', 1),
  (12, 'Programmation du jeu Simon sur un Raspberry Pi Pico (Python)', 1),
  (13, 'Démonstration d\'une impression 3D', 1),
  (14, 'Réalisation d\'un circuit électronique interactif (Arduino, Scratch et Kinect)', 0),
  (15, 'Création d\'une affiche de film (Photoshop)', 0);

INSERT INTO person (id, first_name, last_name, email) VALUES
  (1,'Lucas','Martin','lucas.martin@example.com'),
  (2,'Emma','Bernard','emma.bernard@example.com'),
  (3,'Gabriel','Dubois','gabriel.dubois@example.com'),
  (4,'Léa','Thomas','lea.thomas@example.com'),
  (5,'Louis','Robert','louis.robert@example.com'),
  (6,'Chloé','Richard','chloe.richard@example.com'),
  (7,'Arthur','Petit','arthur.petit@example.com'),
  (8,'Manon','Durand','manon.durand@example.com'),
  (9,'Raphaël','Leroy','raphael.leroy@example.com'),
  (10,'Jade','Moreau','jade.moreau@example.com'),
  (60,'Joël','Dacobeau','lej.dacobeau@example.cn');

INSERT INTO internship (id, person_id, start_date, end_date) VALUES
  (1, 1, '2024-01-09', '2024-07-09'),
  (2, 2, '2024-01-10', '2024-07-10'),
  (3, 3, '2024-01-11', '2024-07-11'),
  (4, 4, '2024-01-12', '2024-07-12'),
  (5, 5, '2024-01-13', '2024-07-13'),
  (6, 6, '2024-01-14', '2024-07-14'),
  (7, 7, '2024-02-09', '2024-08-09'),
  (8, 8, '2024-02-10', '2024-08-10'),
  (9, 9, '2024-02-11', '2024-08-11'),
  (10, 10, '2024-02-12', '2024-08-12'),
  (60, 60, '2025-09-01', '2025-09-02');

INSERT INTO internship_activity (internship_id, activity_id) VALUES
  (1,1),(1,2),(2,3),(2,4),(3,5),(3,6),(4,7),(4,8),(5,9),(5,10),
  (6,11),(6,12),(7,13),(7,14),(8,15),(8,1),(9,2),(9,3),(10,4),(10,5);

-- Descriptions on all visible activities (aligned with the Pencil design / problem4.png)
UPDATE activity SET description = 'Création d\'un jeu de mémoire lumineux avec Python et un Raspberry Pi Pico.' WHERE id = 1;
UPDATE activity SET description = 'Assemblage et configuration d\'un ordinateur de bureau complet.' WHERE id = 2;
UPDATE activity SET description = 'Installation et configuration d\'Ubuntu Linux sur un poste de travail.' WHERE id = 3;
UPDATE activity SET description = 'Création d\'un site web dynamique avec HTML, CSS et PHP.' WHERE id = 4;
UPDATE activity SET description = 'Développement du jeu classique Casse-briques en Small Basic.' WHERE id = 5;
UPDATE activity SET description = 'Recréation du jeu Tetris en Microsoft Small Basic.' WHERE id = 6;
UPDATE activity SET description = 'Développement du jeu Attrape-moi avec le langage Processing.' WHERE id = 7;
UPDATE activity SET description = 'Recréation du jeu Flappy Bird avec Scratch.' WHERE id = 8;
UPDATE activity SET description = 'Développement du jeu Pac-Miam avec Scratch.' WHERE id = 9;
UPDATE activity SET description = 'Programmation et contrôle d\'un robot Ozobot via OzobotEditor.' WHERE id = 10;
UPDATE activity SET description = 'Réalisation d\'une affiche de film avec le logiciel Gimp.' WHERE id = 11;
UPDATE activity SET description = 'Développement du jeu Simon avec Python sur Raspberry Pi Pico.' WHERE id = 12;
UPDATE activity SET description = 'Découverte du fonctionnement d\'une imprimante 3D et démonstration d\'impression d\'un objet.' WHERE id = 13;

-- Seed categories (6 default categories — see screenshots_problem/problem6.png)
INSERT INTO category (id, name, description) VALUES
  (1, 'Développement', 'Activités de programmation, développement logiciel et création de jeux'),
  (2, 'Système', 'Installation, configuration et administration de systèmes d\'exploitation'),
  (3, 'Réseau', 'Activités liées aux réseaux informatiques et à la communication'),
  (4, 'Hardware', 'Montage, configuration et utilisation de matériel informatique'),
  (5, 'Graphisme', 'Création visuelle, retouche d\'image et composition graphique'),
  (6, 'Modélisation 3D', 'Modélisation, impression et démonstration en 3D');

-- Link categories to activities (matches the badges shown in problem4.png)
INSERT INTO activity_category (activity_id, category_id) VALUES
  (1, 1),     -- Ordo Lumina (Python)        → Développement
  (2, 4),     -- Montage poste de travail PC → Hardware
  (3, 2),     -- Installation Ubuntu         → Système
  (4, 1),     -- Site Web HTML/CSS/PHP       → Développement
  (5, 1),     -- Casse-briques               → Développement
  (6, 1),     -- Tetris                      → Développement
  (7, 3),     -- Attrape-moi (Processing)    → Réseau
  (8, 1),     -- Flappy Bird (Scratch)       → Développement
  (9, 1),     -- Pac-Miam (Scratch)          → Développement
  (10, 2),    -- Robot Ozobot                → Système
  (11, 5),    -- Affiche film (Gimp)         → Graphisme
  (12, 1),    -- Simon (Raspberry Pi)        → Développement
  (13, 4),    -- Impression 3D               → Hardware
  (13, 6);    -- Impression 3D               → Modélisation 3D

SET FOREIGN_KEY_CHECKS = 1;
ALTER TABLE internship AUTO_INCREMENT = 1000;
ALTER TABLE person AUTO_INCREMENT = 1000;
ALTER TABLE category AUTO_INCREMENT = 1000;
