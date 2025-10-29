CREATE TABLE IF NOT EXISTS `lastdance`.`tb_post` (
  `post_id` INT NOT NULL AUTO_INCREMENT, -- 게시글 ID
  `user_id` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL, -- 사용자 ID
  `create_at_nickname` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL, -- 작성자 닉네임
  `post_title` VARCHAR(128) NOT NULL, -- 게시글 제목
  `post_content` TEXT NOT NULL, -- 게시글 내용
  `is_notice` TINYINT NULL DEFAULT NULL, -- 공지 여부
  `post_view_cunt` INT NULL DEFAULT NULL, -- 게시글 조회수
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, -- 생성일
  `created_id` VARCHAR(128) NULL DEFAULT NULL, -- 생성자 ID
  `updated_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, -- 수정일
  `updated_id` VARCHAR(128) NULL DEFAULT NULL -- 수정자 ID,
  PRIMARY KEY (`post_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 66
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;