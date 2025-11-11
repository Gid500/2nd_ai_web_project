-- -----------------------------------------------------
-- Table `lastdance`.`tb_flask_img`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_flask_img` (
  `flask_img_id` INT NOT NULL AUTO_INCREMENT,
  `flask_img_url` BLOB NOT NULL,
  `flask_img_name` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`flask_img_id`))
ENGINE = InnoDB;

CREATE TABLE `tb_flask_img` (
  `flask_img_id` INT NOT NULL AUTO_INCREMENT,
  `flask_img_url` BLOB NOT NULL,
  `flask_img_name` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`flask_img_id`) 
) 
ENGINE = InnoDB;