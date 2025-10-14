-- -----------------------------------------------------
-- Table `lastdance`.`tb_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_history` (
  `his_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(128) NOT NULL,
  `his_outfit` VARCHAR(256) NOT NULL,
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_id` VARCHAR(128) NULL DEFAULT NULL,
  PRIMARY KEY (`his_id`, `user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;