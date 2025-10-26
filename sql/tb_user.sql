CREATE TABLE IF NOT EXISTS `lastdance`.`tb_user` (
  `user_id` VARCHAR(128) NOT NULL,
  `user_nickname` VARCHAR(128) NOT NULL,
  `user_email` VARCHAR(256) NOT NULL,
  `user_pwd` VARCHAR(128) NOT NULL,
  `user_img_url` TEXT NULL DEFAULT NULL,
  `role_id` INT NULL DEFAULT NULL,
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_id` VARCHAR(128) NULL DEFAULT NULL,
  `updated_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_id` VARCHAR(128) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_email_UNIQUE` (`user_email` ASC) VISIBLE,
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `user_nickname_UNIQUE` (`user_nickname` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;