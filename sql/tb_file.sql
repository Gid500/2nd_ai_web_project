-- -----------------------------------------------------
-- Table `lastdance`.`tb_file`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_file` (
  `file_id` INT NOT NULL AUTO_INCREMENT,
  `post_id` INT NOT NULL,
  `upload_name` VARCHAR(256) NOT NULL,
  `img_url` BLOB NOT NULL,
  `file_type` VARCHAR(30) NOT NULL,

  PRIMARY KEY (`file_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
