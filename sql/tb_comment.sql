-- -----------------------------------------------------
-- Table `lastdance`.`tb_comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_comment` (
  `comment_id` INT NOT NULL AUTO_INCREMENT, -- 댓글 ID
  `user_id` VARCHAR(128) NOT NULL, -- 사용자 ID
  `post_id` INT NOT NULL, -- 게시글 ID
  `comment` VARCHAR(1256) NOT NULL, -- 댓글 내용
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, -- 생성일
  `created_id` VARCHAR(128) NULL DEFAULT NULL, -- 생성자 ID
  `updated_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, -- 수정일
  `updated_id` VARCHAR(128) NULL DEFAULT NULL -- 수정자 ID,
  PRIMARY KEY (`comment_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
