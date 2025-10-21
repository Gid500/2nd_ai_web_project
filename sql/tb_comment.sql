-- -----------------------------------------------------
-- Table `lastdance`.`tb_comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_comment` (
  `comment_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(128) NOT NULL,
  `post_id` INT NOT NULL,
  `comment` VARCHAR(1256) NOT NULL,
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_id` VARCHAR(128) NULL DEFAULT NULL,
  `updated_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_id` VARCHAR(128) NULL DEFAULT NULL,
  PRIMARY KEY (`comment_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
