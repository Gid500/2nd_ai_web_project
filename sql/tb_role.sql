-- -----------------------------------------------------
-- Table `lastdance`.`tb_role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_role` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `role_type` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`role_id`))
ENGINE = InnoDB;

INSERT INTO tb_role(role_type) VALUES ('user'),('admin');
