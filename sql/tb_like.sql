-- -----------------------------------------------------
-- Table `lastdance`.`tb_like`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_like` (
  `post_id` INT NOT NULL,
  `user_id` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`post_id`, `user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
