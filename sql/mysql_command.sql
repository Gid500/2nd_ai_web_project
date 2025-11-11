-- cmd에서 root으로 mysql 접속
mysql -u root -p

mysql -u lastdance -p

-- mysql 스키마 조회
SHOW SCHEMAS;

-- mysql 스키마 선택
use mysql;

-- 사용자 목록 조회
select user,host from user;

-- mysql DB생성
create database DB이름;

-- sql 계정생성
create user '사용자'@'host' identified by '비밀번호';

-- //ex1) 내부 접근을 허용하는 사용자 추가
create user 'test'@'localhost' identified by '0000';

-- //ex2) 외부 접근을 허용하는 사용자 추가
create user 'test'@'%' identified by '0000';

-- //ex3) 특정 ip만 접근을 허용하는 사용자 추가
create user 'test'@'123.456.789.100' identified by '0000';

-- //ex4) 특정 ip 대역을 허용하는 사용자 추가
create user 'test'@'192.168.%' identified by '0000';

-- 사용자 삭제
drop user '사용자';

-- //또는
delete from user where user='사용자';

-- //예시
drop user 'test'@'localhost';

-- // 모든 데이터베이스의 모든 테이블에 모든 권한을 줌
grant all privileges on *.* to '사용자'@'localhost';

-- // 특정 데이터베이스의 모든 테이블에 모든 권한을 줌
grant all privileges on DB이름.* to '사용자'@'localhost';

-- // 특정 데이터베이스의 특정 테이블에 모든 권한을 줌
grant all privileges on DB이름.테이블명 to '사용자'@'localhost';

-- // 특정 데이터베이스의 특정 테이블에 select 권한을 줌
grant select on DB이름.테이블명 to '사용자'@'localhost';

-- // 특정 데이터베이스의 특정 테이블에 select, insert 권한을 줌
grant select, insert on DB이름.테이블명 to '사용자'@'localhost';

-- // 특정 데이터베이스의 특정 테이블의 컬럼1과 컬럼2의 update 권한을 줌
grant update(컬럼1, 컬럼2) on DB이름.테이블명 to '사용자'@'localhost';

-- 사용자 비번 변경
ALTER USER 'user-name'@'localhost' IDENTIFIED BY 'NEW_USER_PASSWORD';

FLUSH PRIVILEGES;