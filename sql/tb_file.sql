CREATE TABLE IF NOT EXISTS `lastdance`.`tb_file` (
  `file_id` INT NOT NULL AUTO_INCREMENT, -- 파일 ID
  `post_id` INT NOT NULL, -- 게시글 ID
  `upload_name` VARCHAR(256) NOT NULL, -- 업로드 파일명
  `img_url` TEXT NOT NULL, -- 이미지 URL
  `file_type` VARCHAR(30) NOT NULL -- 파일 타입,
  PRIMARY KEY (`file_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;