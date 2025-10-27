CREATE TABLE IF NOT EXISTS `lastdance`.`tb_report` (
  `report_id` INT NOT NULL AUTO_INCREMENT,
  `reported_post_id` INT NULL,              -- 신고된 게시글 id tb_post에 있는 post_id와 join됨
  `reported_comment_id` INT NULL,           -- 신고된 댓글의 id tb_commnet에 있는 comment_id join됨 reported_post_id, reported_comment_id 둘다 null이 아닐경우 댓글 신고이고 reported_post_id만 null이 아닐경우 게시글 신고임
  `reporter_user_id` VARCHAR(128) NOT NULL, -- 신고자 tb_user의 user_id
  `reported_user_id` VARCHAR(128) NOT NULL, -- 신고된 대상의 tb_user의 user_id
  `report_content` TEXT NULL DEFAULT NULL,  -- 신고된 이유를 적는 컬럼
  `report_type_id` INT NOT NULL,            -- 신고 사유 종류 tb_report_type에서 report_type_id와 join됨
  `report_content_type` VARCHAR(64) NULL,
  PRIMARY KEY (`report_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
