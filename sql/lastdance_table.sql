-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema lastdance
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema lastdance
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `lastdance` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `lastdance` ;

-- -----------------------------------------------------
-- Table `lastdance`.`tb_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_user` (
  `user_id` VARCHAR(128) NOT NULL,
  `user_name` VARCHAR(128) NULL DEFAULT NULL,
  `user_nickname` VARCHAR(128) NOT NULL,
  `user_email` VARCHAR(256) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL,
  `user_pwd` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL,
  `user_img_url` BLOB NULL DEFAULT NULL,
  `role_id` INT NULL,
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_id` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
  `updated_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_email_UNIQUE` (`user_email` ASC) VISIBLE,
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `user_nickname_UNIQUE` (`user_nickname` ASC) VISIBLE,
  UNIQUE INDEX `role_id_UNIQUE` (`role_id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `lastdance`.`tb_comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_comment` (
  `comment_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(128) NOT NULL,
  `post_id` INT NOT NULL,
  `comment` VARCHAR(1256) NOT NULL,
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_id` VARCHAR(128) NULL DEFAULT NULL,
  `updated_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_id` VARCHAR(128) NULL DEFAULT NULL,
  PRIMARY KEY (`comment_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `lastdance`.`tb_email_verification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_email_verification` (
  `user_email` VARCHAR(128) NOT NULL,
  `email_code` VARCHAR(128) NOT NULL,
  `verifi_time` TIMESTAMP NOT NULL,
  PRIMARY KEY (`user_email`, `email_code`, `verifi_time`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `lastdance`.`tb_post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_post` (
  `post_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(128) NOT NULL,
  `post_content` BLOB NOT NULL,
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_id` VARCHAR(128) NULL DEFAULT NULL,
  `updated_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_id` VARCHAR(128) NULL DEFAULT NULL,
  PRIMARY KEY (`post_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `lastdance`.`tb_file`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_file` (
  `file_id` INT NOT NULL AUTO_INCREMENT,
  `post_id` INT NOT NULL,
  `upload_name` VARCHAR(256) NOT NULL,
  `file_type` VARCHAR(30) NOT NULL,
  `file_size` INT NULL DEFAULT NULL,
  PRIMARY KEY (`file_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `lastdance`.`tb_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_history` (
  `his_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(128) NOT NULL,
  `his_outfit` VARCHAR(256) NOT NULL,
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_id` VARCHAR(128) NULL DEFAULT NULL,
  PRIMARY KEY (`his_id`, `user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `lastdance`.`tb_like`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_like` (
  `post_id` INT NOT NULL,
  `user_id` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`post_id`, `user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `lastdance`.`tb_refresh_token`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_refresh_token` (
  `token_id` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(128) NOT NULL,
  `expiry_date` TIMESTAMP NOT NULL,
  PRIMARY KEY (`token_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `lastdance`.`tb_report`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_report` (
  `report_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(128) NOT NULL,
  `report_type` VARCHAR(64) NOT NULL,
  `report_content` VARCHAR(640) NULL DEFAULT NULL,
  `created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `lastdance`.`tb_role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lastdance`.`tb_role` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `role_type` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`role_id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
