CREATE TABLE IF NOT EXISTS `lastdance`.`tb_user` (
  `user_id` VARCHAR(128) NOT NULL, -- 사용자 ID
  `user_nickname` VARCHAR(128) NOT NULL, -- 사용자 닉네임
  `user_email` VARCHAR(256) NOT NULL, -- 사용자 이메일
  `user_pwd` VARCHAR(VARCHAR) NOT NULL, -- 사용자 비밀번호
  `user_img_url` TEXT NULL DEFAULT NULL, -- 사용자 이미지 URL
  `role_id` INT NULL DEFAULT NULL, -- 규칙 ID
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, -- 생성일
  `created_id` VARCHAR(128) NULL DEFAULT NULL, -- 생성자 ID
  `updated_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, -- 수정일
  `updated_id` VARCHAR(128) NULL DEFAULT NULL -- 수정자 ID
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_email_UNIQUE` (`user_email` ASC) VISIBLE,
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `user_nickname_UNIQUE` (`user_nickname` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;