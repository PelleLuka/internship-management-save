CREATE TABLE `internship` (
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `first_name` varchar(80) NOT NULL,
    `last_name` varchar(80) NOT NULL,
    `email` varchar(254) NOT NULL,
    `start_date` date NOT NULL,
    `end_date` date NOT NULL,
    CONSTRAINT `chk_internship_dates_valid` CHECK (`end_date` >= `start_date`)
);

CREATE TABLE `activity` (
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` varchar(255) NOT NULL,
    `visible` boolean NOT NULL DEFAULT true COMMENT 'Indicates if the activity is visible in the frontend'
);

CREATE TABLE `internship_activity` (
    `internship_id` int NOT NULL,
    `activity_id` int NOT NULL,
    PRIMARY KEY (
        `internship_id`,
        `activity_id`
    ),
    FOREIGN KEY (`internship_id`) REFERENCES `internship` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
    FOREIGN KEY (`activity_id`) REFERENCES `activity` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
);