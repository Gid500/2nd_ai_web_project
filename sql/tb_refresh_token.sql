-- -----------------------------------------------------
-- Table `lastdance`.`tb_refresh_token`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_refresh_token` (
  `token_id` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(128) NOT NULL,
  `expiry_date` TIMESTAMP NOT NULL,
  PRIMARY KEY (`token_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;