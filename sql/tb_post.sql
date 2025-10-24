CREATE TABLE IF NOT EXISTS `lastdance`.`tb_post` (
  `post_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(128) NULL,
  `post_title` VARCHAR(128) NOT NULL,
  `post_content` BLOB NOT NULL,
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_id` VARCHAR(128) NULL DEFAULT NULL,
  `updated_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `anoy_user_name` VARCHAR(128) NULL,
  `anoy_user_pwd` VARCHAR(64) NULL,
  PRIMARY KEY (`post_id`)
  )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;