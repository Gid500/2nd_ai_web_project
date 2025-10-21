-- -----------------------------------------------------
-- Table `lastdance`.`tb_report`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_report` (
  `report_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(128) NOT NULL,
  `report_type` VARCHAR(64) NOT NULL,
  `report_content` VARCHAR(640) NULL DEFAULT NULL,
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
