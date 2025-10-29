-- -----------------------------------------------------
-- Table `lastdance`.`tb_email_verification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_email_verification` (
  `user_email` VARCHAR(128) NOT NULL, -- 사용자 이메일
  `email_code` VARCHAR(128) NOT NULL, -- 이메일 인증 코드
  `verifi_time` TIMESTAMP NOT NULL -- 인증 유효 시간,
  PRIMARY KEY (`user_email`, `email_code`, `verifi_time`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
