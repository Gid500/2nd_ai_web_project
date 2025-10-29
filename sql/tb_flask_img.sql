-- -----------------------------------------------------
-- Table `lastdance`.`tb_flask_img`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_flask_img` (
  `flask_img_id` INT NOT NULL AUTO_INCREMENT, -- 플라스크 이미지 ID
  `flask_img_url` BLOB NOT NULL, -- 플라스크 이미지 URL
  `flask_img_name` VARCHAR(128) NOT NULL -- 플라스크 이미지 이름
  PRIMARY KEY (`flask_img_id`))
ENGINE = InnoDB;