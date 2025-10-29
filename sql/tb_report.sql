CREATE TABLE IF NOT EXISTS `lastdance`.`tb_report` (
  `report_id` INT NOT NULL AUTO_INCREMENT, -- 신고 ID
  `reported_post_id` INT NULL, -- 신고된 게시글 ID
  `reported_comment_id` INT NULL, -- 신고된 댓글 ID
  `reporter_user_id` VARCHAR(128) NOT NULL, -- 신고자 ID
  `reported_user_id` VARCHAR(128) NOT NULL, -- 신고 대상 사용자 ID
  `report_content` TEXT NULL DEFAULT NULL, -- 신고 내용
  `report_type_id` INT NOT NULL, -- 신고 유형 ID
  `report_content_type` VARCHAR(64) NULL -- 신고 내용 타입
  PRIMARY KEY (`report_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
