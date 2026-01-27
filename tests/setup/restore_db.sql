-- Full Restore of Internships from db.json
-- Generated automatically.
-- Resets tables and inserts all internships with correct IDs.
-- ID 'c91b' is mapped to integer (following sequence).

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE internship_activity;

TRUNCATE TABLE internship;

TRUNCATE TABLE activity;

INSERT INTO
    activity (id, title, visible)
VALUES (
        1,
        'Jeu de mémoire lumineux Ordo Lumina (Python)',
        1
    ),
    (
        2,
        'Montage d\'un poste de travail PC',
        1
    ),
    (
        3,
        'Installation d\'un système d\'exploitation (Ubuntu)',
        1
    ),
    (
        4,
        'Réalisation d\'un site Web (HTML, CSS et PHP)',
        1
    ),
    (
        5,
        'Programmation du jeu Casse-briques (Microsoft Small Basic)',
        1
    ),
    (
        6,
        'Programmation du jeu Tetris (Microsoft Small Basic)',
        1
    ),
    (
        7,
        'Programmation du jeu Attrape-moi (Processing)',
        1
    ),
    (
        8,
        'Programmation du jeu Flappy Bird (Scratch)',
        1
    ),
    (
        9,
        'Programmation du jeu Pac-Miam (Scratch)',
        1
    ),
    (
        10,
        'Programmation d\'un robot Ozobot (OzoBlockly)',
        1
    ),
    (
        11,
        'Création d\'une affiche de film (Gimp)',
        1
    ),
    (
        12,
        'Programmation du jeu Simon sur un Raspberry Pi Pico (Python)',
        1
    ),
    (
        13,
        'Programmation d\'un robot (LEGO Mindstorms)',
        0
    ),
    (
        14,
        'Réalisation d\'un circuit électronique interactif (Arduino, Scratch et Kinect)',
        0
    ),
    (
        15,
        'Création d\'une affiche de film (Photoshop)',
        0
    );

INSERT INTO
    internship (
        id,
        first_name,
        last_name,
        email,
        start_date,
        end_date
    )
VALUES (
        1,
        'Lucas',
        'Martin',
        'lucas.martin@example.com',
        '2024-01-09',
        '2024-07-09'
    ),
    (
        2,
        'Emma',
        'Bernard',
        'emma.bernard@example.com',
        '2024-01-10',
        '2024-07-10'
    ),
    (
        3,
        'Gabriel',
        'Dubois',
        'gabriel.dubois@example.com',
        '2024-01-11',
        '2024-07-11'
    ),
    (
        4,
        'Léa',
        'Thomas',
        'lea.thomas@example.com',
        '2024-01-12',
        '2024-07-12'
    ),
    (
        5,
        'Louis',
        'Robert',
        'louis.robert@example.com',
        '2024-01-13',
        '2024-07-13'
    ),
    (
        6,
        'Chloé',
        'Richard',
        'chloe.richard@example.com',
        '2024-01-14',
        '2024-07-14'
    ),
    (
        7,
        'Arthur',
        'Petit',
        'arthur.petit@example.com',
        '2024-02-09',
        '2024-08-09'
    ),
    (
        8,
        'Manon',
        'Durand',
        'manon.durand@example.com',
        '2024-02-10',
        '2024-08-10'
    ),
    (
        9,
        'Raphaël',
        'Leroy',
        'raphael.leroy@example.com',
        '2024-02-11',
        '2024-08-11'
    ),
    (
        10,
        'Jade',
        'Moreau',
        'jade.moreau@example.com',
        '2024-02-12',
        '2024-08-12'
    ),
    (
        11,
        'Léo',
        'Simon',
        'leo.simon@example.com',
        '2024-02-13',
        '2024-08-13'
    ),
    (
        12,
        'Louise',
        'Laurent',
        'louise.laurent@example.com',
        '2024-02-14',
        '2024-08-14'
    ),
    (
        13,
        'Maël',
        'Lefebvre',
        'mael.lefebvre@example.com',
        '2024-03-09',
        '2024-09-09'
    ),
    (
        14,
        'Alice',
        'Michel',
        'alice.michel@example.com',
        '2024-03-10',
        '2024-09-10'
    ),
    (
        15,
        'Jules',
        'Garcia',
        'jules.garcia@example.com',
        '2024-03-11',
        '2024-09-11'
    ),
    (
        16,
        'Lina',
        'David',
        'lina.david@example.com',
        '2024-03-12',
        '2024-09-12'
    ),
    (
        17,
        'Adam',
        'Bertrand',
        'adam.bertrand@example.com',
        '2024-03-13',
        '2024-09-13'
    ),
    (
        18,
        'Mila',
        'Roux',
        'mila.roux@example.com',
        '2024-03-14',
        '2024-09-14'
    ),
    (
        19,
        'Paul',
        'Vincent',
        'paul.vincent@example.com',
        '2024-04-09',
        '2024-10-09'
    ),
    (
        20,
        'Rose',
        'Fournier',
        'rose.fournier@example.com',
        '2024-04-10',
        '2024-10-10'
    ),
    (
        21,
        'Sacha',
        'Morel',
        'sacha.morel@example.com',
        '2024-04-11',
        '2024-10-11'
    ),
    (
        22,
        'Anna',
        'Girard',
        'anna.girard@example.com',
        '2024-04-12',
        '2024-10-12'
    ),
    (
        23,
        'Gabin',
        'Andre',
        'gabin.andre@example.com',
        '2024-04-13',
        '2024-10-13'
    ),
    (
        24,
        'Inès',
        'Lefevre',
        'ines.lefevre@example.com',
        '2024-04-14',
        '2024-10-14'
    ),
    (
        25,
        'Noah',
        'Mercier',
        'noah.mercier@example.com',
        '2024-05-09',
        '2024-11-09'
    ),
    (
        26,
        'Mia',
        'Dupont',
        'mia.dupont@example.com',
        '2024-05-10',
        '2024-11-10'
    ),
    (
        27,
        'Liam',
        'Lambert',
        'liam.lambert@example.com',
        '2024-05-11',
        '2024-11-11'
    ),
    (
        28,
        'Ambre',
        'Bonnet',
        'ambre.bonnet@example.com',
        '2024-05-12',
        '2024-11-12'
    ),
    (
        29,
        'Ethan',
        'Francois',
        'ethan.francois@example.com',
        '2024-05-13',
        '2024-11-13'
    ),
    (
        30,
        'Julia',
        'Martinez',
        'julia.martinez@example.com',
        '2024-05-14',
        '2024-11-14'
    ),
    (
        31,
        'Hugo',
        'Legrand',
        'hugo.legrand@example.com',
        '2025-01-09',
        '2025-07-09'
    ),
    (
        32,
        'Lou',
        'Garnier',
        'lou.garnier@example.com',
        '2025-01-10',
        '2025-07-10'
    ),
    (
        33,
        'Lucas',
        'Faure',
        'lucas.faure@example.com',
        '2025-01-11',
        '2025-07-11'
    ),
    (
        34,
        'Zoé',
        'Rousseau',
        'zoe.rousseau@example.com',
        '2025-01-12',
        '2025-07-12'
    ),
    (
        35,
        'Nathan',
        'Blanc',
        'nathan.blanc@example.com',
        '2025-01-13',
        '2025-07-13'
    ),
    (
        36,
        'Léna',
        'Guerin',
        'lena.guerin@example.com',
        '2025-01-14',
        '2025-07-14'
    ),
    (
        37,
        'Théo',
        'Muller',
        'theo.muller@example.com',
        '2025-02-09',
        '2025-08-09'
    ),
    (
        38,
        'Agathe',
        'Henry',
        'agathe.henry@example.com',
        '2025-02-10',
        '2025-08-10'
    ),
    (
        39,
        'Tom',
        'Roussel',
        'tom.roussel@example.com',
        '2025-02-11',
        '2025-08-11'
    ),
    (
        40,
        'Sarah',
        'Nicolas',
        'sarah.nicolas@example.com',
        '2025-02-12',
        '2025-08-12'
    ),
    (
        41,
        'Nolan',
        'Perrin',
        'nolan.perrin@example.com',
        '2025-02-13',
        '2025-08-13'
    ),
    (
        42,
        'Eva',
        'Morin',
        'eva.morin@example.com',
        '2025-02-14',
        '2025-08-14'
    ),
    (
        43,
        'Enzo',
        'Mathieu',
        'enzo.mathieu@example.com',
        '2025-03-09',
        '2025-09-09'
    ),
    (
        44,
        'Jeanne',
        'Clement',
        'jeanne.clement@example.com',
        '2025-03-10',
        '2025-09-10'
    ),
    (
        45,
        'Mathis',
        'Gauthier',
        'mathis.gauthier@example.com',
        '2025-03-11',
        '2025-09-11'
    ),
    (
        46,
        'Camille',
        'Dumont',
        'camille.dumont@example.com',
        '2025-03-12',
        '2025-09-12'
    ),
    (
        47,
        'Axel',
        'Lopez',
        'axel.lopez@example.com',
        '2025-03-13',
        '2025-09-13'
    ),
    (
        48,
        'Juliette',
        'Fontaine',
        'juliette.fontaine@example.com',
        '2025-03-14',
        '2025-09-14'
    ),
    (
        49,
        'Antoine',
        'Chevalier',
        'antoine.chevalier@example.com',
        '2025-04-09',
        '2025-10-09'
    ),
    (
        50,
        'Romane',
        'Robin',
        'romane.robin@example.com',
        '2025-04-10',
        '2025-10-10'
    ),
    (
        51,
        'Valentin',
        'Masson',
        'valentin.masson@example.com',
        '2025-04-11',
        '2025-10-11'
    ),
    (
        52,
        'Clara',
        'Sanchez',
        'clara.sanchez@example.com',
        '2025-04-12',
        '2025-10-12'
    ),
    (
        53,
        'Maxime',
        'Gerard',
        'maxime.gerard@example.com',
        '2025-04-13',
        '2025-10-13'
    ),
    (
        54,
        'Charlotte',
        'Nguyen',
        'charlotte.nguyen@example.com',
        '2025-04-14',
        '2025-10-14'
    ),
    (
        55,
        'Baptiste',
        'Boyer',
        'baptiste.boyer@example.com',
        '2025-05-09',
        '2025-11-09'
    ),
    (
        56,
        'Margaux',
        'Denis',
        'margaux.denis@example.com',
        '2025-05-10',
        '2025-11-10'
    ),
    (
        57,
        'Corentin',
        'Lemaire',
        'corentin.lemaire@example.com',
        '2025-05-11',
        '2025-11-11'
    ),
    (
        58,
        'Elise',
        'Duval',
        'elise.duval@example.com',
        '2025-05-12',
        '2025-11-12'
    ),
    (
        59,
        'Thibault',
        'Joly',
        'thibault.joly@example.com',
        '2025-05-13',
        '2025-11-13'
    ),
    (
        60,
        'Joël',
        'Dacobeau',
        'lej.dacobeau@example.cn',
        '2025-09-01',
        '2025-09-02'
    );

-- Add associations between Internships and Activities
INSERT INTO
    internship_activity (internship_id, activity_id)
VALUES
    -- Intern 1-10
    (1, 1),
    (1, 2),
    (2, 3),
    (2, 4),
    (3, 5),
    (3, 6),
    (4, 7),
    (4, 8),
    (5, 9),
    (5, 10),
    (6, 11),
    (6, 12),
    (7, 13),
    (7, 14),
    (8, 15),
    (8, 1),
    (9, 2),
    (9, 3),
    (10, 4),
    (10, 5),
    (11, 6),
    (11, 7),
    (12, 8),
    (12, 9),
    (13, 10),
    (13, 11),
    (14, 12),
    (14, 13),
    (15, 14),
    (15, 15),
    (16, 1),
    (16, 3),
    (17, 2),
    (17, 4),
    (18, 5),
    (18, 7),
    (19, 6),
    (19, 8),
    (20, 9),
    (20, 11),
    (21, 10),
    (21, 12),
    (22, 13),
    (22, 15),
    (23, 14),
    (23, 1),
    (24, 2),
    (24, 3),
    (25, 4),
    (25, 5),
    (26, 6),
    (26, 7),
    (27, 8),
    (27, 9),
    (28, 10),
    (28, 11),
    (29, 12),
    (29, 13),
    (30, 14),
    (30, 15),
    (31, 1),
    (31, 2),
    (32, 3),
    (32, 4),
    (33, 5),
    (33, 6),
    (34, 7),
    (34, 8),
    (35, 9),
    (35, 10),
    (36, 11),
    (36, 12),
    (37, 13),
    (37, 14),
    (38, 15),
    (38, 1),
    (39, 2),
    (39, 3),
    (40, 4),
    (40, 5),
    (41, 6),
    (41, 7),
    (42, 8),
    (42, 9),
    (43, 10),
    (43, 11),
    (44, 12),
    (44, 13),
    (45, 14),
    (45, 15),
    (46, 1),
    (46, 3),
    (47, 2),
    (47, 4),
    (48, 5),
    (48, 7),
    (49, 6),
    (49, 8),
    (50, 9),
    (50, 11),
    (51, 10),
    (51, 12),
    (52, 13),
    (52, 15),
    (53, 14),
    (53, 1),
    (54, 2),
    (54, 3),
    (55, 4),
    (55, 5),
    (56, 6),
    (56, 7),
    (57, 8),
    (57, 9),
    (58, 10),
    (58, 11),
    (59, 12),
    (59, 13),
    (60, 14),
    (60, 15);

SET FOREIGN_KEY_CHECKS = 1;
-- Reset Auto Increment to safe value
ALTER TABLE internship AUTO_INCREMENT = 1000;