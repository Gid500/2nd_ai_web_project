CREATE TABLE IF NOT EXISTS `lastdance`.`tb_report_type` (
  `report_type_id` INT NOT NULL AUTO_INCREMENT,
  `type_name` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`report_type_id`))
ENGINE = InnoDB

insert into lastdance.tb_report_type (type_name) 
VALUES('욕설'), ('광고'), ('음란물');