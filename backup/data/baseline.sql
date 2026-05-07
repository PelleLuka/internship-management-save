/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.10-MariaDB, for Linux (aarch64)
--
-- Host: database    Database: internship_management
-- ------------------------------------------------------
-- Server version	11.6.2-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `document_url` varchar(500) DEFAULT NULL,
  `visible` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Indicates if the activity is visible in the frontend',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` VALUES
(1,'Jeu de mémoire lumineux Ordo Lumina (Python)','Création d\'un jeu de mémoire lumineux avec Python et un Raspberry Pi Pico.',NULL,1),
(2,'Montage d\'un poste de travail PC','Assemblage et configuration d\'un ordinateur de bureau complet.',NULL,1),
(3,'Installation d\'un système d\'exploitation (Ubuntu)','Installation et configuration d\'Ubuntu Linux sur un poste de travail.',NULL,1),
(4,'Réalisation d\'un site Web (HTML, CSS et PHP)','Création d\'un site web dynamique avec HTML, CSS et PHP.',NULL,1),
(5,'Programmation du jeu Casse-briques (Microsoft Small Basic)','Développement du jeu classique Casse-briques en Small Basic.',NULL,1),
(6,'Programmation du jeu Tetris (Microsoft Small Basic)','Recréation du jeu Tetris en Microsoft Small Basic.',NULL,1),
(7,'Programmation du jeu Attrape-moi (Processing)','Développement du jeu Attrape-moi avec le langage Processing.',NULL,1),
(8,'Programmation du jeu Flappy Bird (Scratch)','Recréation du jeu Flappy Bird avec Scratch.',NULL,1),
(9,'Programmation du jeu Pac-Miam (Scratch)','Développement du jeu Pac-Miam avec Scratch.',NULL,1),
(10,'Programmation d\'un robot Ozobot (OzobotEditor)','Programmation et contrôle d\'un robot Ozobot via OzobotEditor.',NULL,1),
(11,'Création d\'une affiche de film (Gimp)','Réalisation d\'une affiche de film avec le logiciel Gimp.',NULL,1),
(12,'Programmation du jeu Simon sur un Raspberry Pi Pico (Python)','Développement du jeu Simon avec Python sur Raspberry Pi Pico.',NULL,1),
(13,'Démonstration d\'une impression 3D','Découverte du fonctionnement d\'une imprimante 3D et démonstration d\'impression d\'un objet.',NULL,1),
(14,'Réalisation d\'un circuit électronique interactif (Arduino, Scratch et Kinect)',NULL,NULL,0),
(15,'Création d\'une affiche de film (Photoshop)',NULL,NULL,0);
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_category`
--

DROP TABLE IF EXISTS `activity_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_category` (
  `activity_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`activity_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `activity_category_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`id`) ON DELETE CASCADE,
  CONSTRAINT `activity_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_category`
--

LOCK TABLES `activity_category` WRITE;
/*!40000 ALTER TABLE `activity_category` DISABLE KEYS */;
INSERT INTO `activity_category` VALUES
(1,1),
(4,1),
(5,1),
(6,1),
(8,1),
(9,1),
(12,1),
(3,2),
(10,2),
(7,3),
(2,4),
(13,4),
(11,5),
(13,6);
/*!40000 ALTER TABLE `activity_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES
(1,'Développement','Activités de programmation, développement logiciel et création de jeux'),
(2,'Système','Installation, configuration et administration de systèmes d\'exploitation'),
(3,'Réseau','Activités liées aux réseaux informatiques et à la communication'),
(4,'Hardware','Montage, configuration et utilisation de matériel informatique'),
(5,'Graphisme','Création visuelle, retouche d\'image et composition graphique'),
(6,'Modélisation 3D','Modélisation, impression et démonstration en 3D');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internship`
--

DROP TABLE IF EXISTS `internship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `internship` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `person_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_internship_person` (`person_id`),
  CONSTRAINT `fk_internship_person` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_internship_dates_valid` CHECK (`end_date` >= `start_date`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internship`
--

LOCK TABLES `internship` WRITE;
/*!40000 ALTER TABLE `internship` DISABLE KEYS */;
INSERT INTO `internship` VALUES
(1,'2024-01-09','2024-07-09',1),
(2,'2024-01-10','2024-07-10',2),
(3,'2024-01-11','2024-07-11',3),
(4,'2024-01-12','2024-07-12',4),
(5,'2024-01-13','2024-07-13',5),
(6,'2024-01-14','2024-07-14',6),
(7,'2024-02-09','2024-08-09',7),
(8,'2024-02-10','2024-08-10',8),
(9,'2024-02-11','2024-08-11',9),
(10,'2024-02-12','2024-08-12',10),
(60,'2025-09-01','2025-09-02',60),
(100,'2026-04-02','2026-04-03',100),
(101,'2026-04-09','2026-04-10',101),
(102,'2026-04-16','2026-04-17',102),
(103,'2026-04-23','2026-04-24',103),
(104,'2026-04-30','2026-05-01',104),
(105,'2026-05-04','2026-05-05',105),
(106,'2026-05-05','2026-05-06',106),
(107,'2026-05-06','2026-05-07',107),
(108,'2026-05-14','2026-05-15',108),
(109,'2026-05-25','2026-05-26',109),
(110,'2026-06-02','2026-06-03',110),
(111,'2026-06-09','2026-06-10',111),
(112,'2026-06-16','2026-06-17',112),
(113,'2026-06-23','2026-06-24',113),
(114,'2026-06-29','2026-06-30',114);
/*!40000 ALTER TABLE `internship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internship_activity`
--

DROP TABLE IF EXISTS `internship_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `internship_activity` (
  `internship_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  PRIMARY KEY (`internship_id`,`activity_id`),
  KEY `activity_id` (`activity_id`),
  CONSTRAINT `internship_activity_ibfk_1` FOREIGN KEY (`internship_id`) REFERENCES `internship` (`id`) ON DELETE CASCADE,
  CONSTRAINT `internship_activity_ibfk_2` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internship_activity`
--

LOCK TABLES `internship_activity` WRITE;
/*!40000 ALTER TABLE `internship_activity` DISABLE KEYS */;
INSERT INTO `internship_activity` VALUES
(1,1),
(8,1),
(100,1),
(105,1),
(110,1),
(1,2),
(9,2),
(101,2),
(106,2),
(111,2),
(2,3),
(9,3),
(101,3),
(111,3),
(2,4),
(10,4),
(100,4),
(105,4),
(110,4),
(3,5),
(10,5),
(102,5),
(107,5),
(114,5),
(3,6),
(102,6),
(114,6),
(4,7),
(103,7),
(113,7),
(4,8),
(103,8),
(108,8),
(114,8),
(5,9),
(104,9),
(108,9),
(5,10),
(6,11),
(106,11),
(112,11),
(6,12),
(109,12),
(7,13),
(112,13),
(7,14),
(8,15);
/*!40000 ALTER TABLE `internship_activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(80) NOT NULL,
  `last_name` varchar(80) NOT NULL,
  `email` varchar(254) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES
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
(60,'Joël','Dacobeau','lej.dacobeau@example.cn'),
(100,'Lucie','Bernard','lucie.bernard@example.com'),
(101,'Antoine','Lefebvre','antoine.lefebvre@example.com'),
(102,'Sophie','Mercier','sophie.mercier@example.com'),
(103,'Hugo','Garnier','hugo.garnier@example.com'),
(104,'Camille','Roux','camille.roux@example.com'),
(105,'Nathan','Faure','nathan.faure@example.com'),
(106,'Inès','Vincent','ines.vincent@example.com'),
(107,'Maxime','Henry','maxime.henry@example.com'),
(108,'Clara','Roussel','clara.roussel@example.com'),
(109,'Ethan','Mathieu','ethan.mathieu@example.com'),
(110,'Zoé','Rolland','zoe.rolland@example.com'),
(111,'Samuel','Carpentier','samuel.carpentier@example.com'),
(112,'Noémie','Baron','noemie.baron@example.com'),
(113,'Théo','Schmitt','theo.schmitt@example.com'),
(114,'Emma','Lopez','emma.lopez@example.com');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-05-06 14:03:20
