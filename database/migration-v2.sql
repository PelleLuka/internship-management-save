-- Migration v1 → v2 : séparation person / internship
-- NON-DESTRUCTIVE : données existantes préservées

-- 1. Créer la table person
CREATE TABLE IF NOT EXISTS `person` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(80) NOT NULL,
  `last_name` VARCHAR(80) NOT NULL,
  `email` VARCHAR(254) NOT NULL
);

-- 2. Remplir person depuis internship (1 person par internship, même ordre)
INSERT INTO `person` (first_name, last_name, email)
SELECT first_name, last_name, email FROM `internship` ORDER BY id;

-- 3. Ajouter person_id (nullable pour l'instant)
ALTER TABLE `internship` ADD COLUMN `person_id` INT NULL;

-- 4. Associer chaque internship à sa person (même position dans les deux tables)
UPDATE `internship` SET `person_id` = `id`;

-- 5. Contraintes
ALTER TABLE `internship`
  MODIFY COLUMN `person_id` INT NOT NULL,
  ADD CONSTRAINT `fk_internship_person`
    FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON DELETE CASCADE;

-- 6. Supprimer les colonnes identité de internship
ALTER TABLE `internship`
  DROP COLUMN `first_name`,
  DROP COLUMN `last_name`,
  DROP COLUMN `email`;

-- 7. Nouvelles colonnes sur activity
ALTER TABLE `activity`
  ADD COLUMN `description` TEXT NULL AFTER `title`,
  ADD COLUMN `document_url` VARCHAR(500) NULL AFTER `description`;

-- 8. Nouvelle table category
CREATE TABLE IF NOT EXISTS `category` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL
);

-- 9. Nouvelle table activity_category
CREATE TABLE IF NOT EXISTS `activity_category` (
  `activity_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`activity_id`, `category_id`),
  FOREIGN KEY (`activity_id`) REFERENCES `activity`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT
);

-- Reset auto_increment
ALTER TABLE `person` AUTO_INCREMENT = 1000;
