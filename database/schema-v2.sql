CREATE TABLE `person` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(80) NOT NULL,
  `last_name` VARCHAR(80) NOT NULL,
  `email` VARCHAR(254) NOT NULL
);

CREATE TABLE `internship` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `person_id` INT NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  CONSTRAINT `chk_internship_dates_valid` CHECK (`end_date` >= `start_date`),
  CONSTRAINT `fk_internship_person`
    FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON DELETE CASCADE
);

CREATE TABLE `activity` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `document_url` VARCHAR(500) NULL,
  `visible` BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE `category` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL
);

CREATE TABLE `internship_activity` (
  `internship_id` INT NOT NULL,
  `activity_id` INT NOT NULL,
  PRIMARY KEY (`internship_id`, `activity_id`),
  FOREIGN KEY (`internship_id`) REFERENCES `internship`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`activity_id`) REFERENCES `activity`(`id`) ON DELETE RESTRICT
);

CREATE TABLE `activity_category` (
  `activity_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`activity_id`, `category_id`),
  FOREIGN KEY (`activity_id`) REFERENCES `activity`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT
);
