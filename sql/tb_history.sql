-- -----------------------------------------------------
-- Table `lastdance`.`tb_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_history` (
  `his_id` INT NOT NULL AUTO_INCREMENT, -- 기록 ID
  `user_id` VARCHAR(128) NOT NULL, -- 사용자 ID
  `his_outfit` VARCHAR(256) NOT NULL, -- 기록 의상
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, -- 생성일
  `created_id` VARCHAR(128) NULL DEFAULT NULL -- 생성자 ID
  PRIMARY KEY (`his_id`, `user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
