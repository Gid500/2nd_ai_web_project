CREATE TABLE IF NOT EXISTS `lastdance`.`tb_report` (
  `report_id` INT NOT NULL AUTO_INCREMENT,
  `reported_post_id` INT NULL DEFAULT NULL,
  `reported_comment_id` INT NULL DEFAULT NULL,
  `reporter_user_id` VARCHAR(128) NOT NULL,
  `reported_user_id` VARCHAR(128) NOT NULL,
  `report_content` TEXT NULL DEFAULT NULL,
  `report_type_id` INT NOT NULL DEFAULT 0,
  `report_content_type` VARCHAR(64) NOT NULL,
  `report_status` TINYINT NOT NULL DEFAULT '0', -- 0은 처리중 1은 처리완료(삭제완료) 2는 반려
  `create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;