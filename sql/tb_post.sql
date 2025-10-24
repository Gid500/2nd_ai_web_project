CREATE TABLE IF NOT EXISTS `lastdance`.`tb_post` (
  `post_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(128) NOT NULL,
  `post_title` VARCHAR(128) NOT NULL,
  `post_content` text NOT NULL,
  `is_notice` TINYINT NULL,
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_id` VARCHAR(128) NULL DEFAULT NULL,
  `updated_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_id` VARCHAR(128) NULL DEFAULT NULL,
  `post_title` VARCHAR(128) NULL DEFAULT NULL,
  `anoy_user_name` VARCHAR(128) NULL,
  'anoy_user_pwd' VARCHAR(64) NULL,
  PRIMARY KEY (`post_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

ALTER TABLE `tb_post`
	ADD COLUMN `is_notice` TINYINT NULL DEFAULT NULL AFTER `post_content`;