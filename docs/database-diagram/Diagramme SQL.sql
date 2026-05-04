CREATE TABLE `internships` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `first_name` varchar(80) NOT NULL,
  `last_name` varchar(80) NOT NULL,
  `email` varchar(254) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  CONSTRAINT `chk_internship_dates_valid` CHECK (end_date >= start_date)
);

CREATE TABLE `activities` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `visible` boolean NOT NULL DEFAULT true COMMENT 'Indicates if the activity is visible in the frontend'
);

CREATE TABLE `internship_activities` (
  `internship_id` integer NOT NULL,
  `activity_id` integer NOT NULL,
  `primary` key(internship_id,activity_id)
);

ALTER TABLE `internship_activities` ADD FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE `internship_activities` ADD FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
