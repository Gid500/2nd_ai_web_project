CREATE TABLE IF NOT EXISTS `lastdance`.`tb_report` (
  `report_id` INT NOT NULL AUTO_INCREMENT,
  `reporter_user_id` VARCHAR(128) NOT NULL, -- 신고자 tb_user의 user_id
  `reported_user_id` VARCHAR(128) NOT NULL, -- 신고된 대상의 tb_user의 user_id
  `report_content` TEXT NULL DEFAULT NULL,
  `report_type` VARCHAR(64) NOT NULL,       -- 신고 사유 종류
  `report_content_type` VARCHAR(64) NULL,
  PRIMARY KEY (`report_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

drop table tb_report;

insert into tb_report_type (type_name) VALUES('욕설'), ('광고'), ('음란물');