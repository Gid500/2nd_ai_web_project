package com.revia.lastdance.mypage.service;

import com.revia.lastdance.config.EmailVerificationProperties;
import com.revia.lastdance.mypage.dao.MypageMapper;
import com.revia.lastdance.signup.vo.EmailVerificationVO;
import com.revia.lastdance.signup.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.UUID;

@Service
public class MypageService {

    @Autowired
    private MypageMapper mypageMapper;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailVerificationProperties emailVerificationProperties;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public UserVO getUserById(String userId) {
        return mypageMapper.getUserById(userId);
    }

    public void updateUserNickname(UserVO userVO) {
        // Check for duplicate nickname, excluding the current user
        if (mypageMapper.checkNicknameAvailability(userVO.getUserNickname(), userVO.getUserId()) > 0) {
            throw new IllegalArgumentException("Nickname already exists.");
        }
        mypageMapper.updateUserNickname(userVO);
    }

    public boolean checkNicknameAvailability(String nickname, String userId) {
        return mypageMapper.checkNicknameAvailability(nickname, userId) == 0;
    }

    public void requestPasswordReset(String userEmail) throws MessagingException {
        // Generate a random 6-digit code
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // 6-digit code
        String emailCode = String.valueOf(code);

        // Set expiration time
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MILLISECOND, (int) emailVerificationProperties.getExpiration());
        Timestamp verifiTime = new Timestamp(calendar.getTimeInMillis());

        // Save to database
        EmailVerificationVO emailVerificationVO = new EmailVerificationVO();
        emailVerificationVO.setUserEmail(userEmail);
        emailVerificationVO.setEmailCode(emailCode);
        emailVerificationVO.setVerifiTime(verifiTime);
        mypageMapper.insertEmailVerification(emailVerificationVO);

        // Send email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(userEmail);
        helper.setSubject("[LastDance] Password Reset Verification Code");
        helper.setText("Your password reset verification code is: " + emailCode + ". This code is valid for " + (emailVerificationProperties.getExpiration() / 60000) + " minutes.", true);
        mailSender.send(message);
    }

    public boolean resetPassword(String userEmail, String emailCode, String newPassword) {
        EmailVerificationVO storedVerification = new EmailVerificationVO();
        storedVerification.setUserEmail(userEmail);
        storedVerification.setEmailCode(emailCode);
        storedVerification = mypageMapper.selectEmailVerification(storedVerification);

        if (storedVerification == null) {
            return false; // Code not found or incorrect
        }

        // Check if the code has expired
        if (storedVerification.getVerifiTime().before(new Timestamp(System.currentTimeMillis()))) {
            mypageMapper.deleteEmailVerification(storedVerification); // Delete expired code
            return false; // Code expired
        }

        // Update password
        UserVO userVO = new UserVO();
        userVO.setUserEmail(userEmail);
        userVO.setUserPwd(bCryptPasswordEncoder.encode(newPassword));
        mypageMapper.updateUserPassword(userVO);

        // Delete verification record
        mypageMapper.deleteEmailVerification(storedVerification);
        return true;
    }

    public String uploadProfileImage(String userId, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file.");
        }

        // 1. Retrieve the current user's profile information
        UserVO currentUser = mypageMapper.getUserById(userId);
        String oldUserImgUrl = null;
        if (currentUser != null) {
            oldUserImgUrl = currentUser.getUserImgUrl();
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);

        String userImgUrl = "/images/" + uniqueFileName; // Store relative path in DB

        UserVO userVO = new UserVO();
        userVO.setUserId(userId);
        userVO.setUserImgUrl(userImgUrl);
        mypageMapper.updateUserImgUrl(userVO);

        // 2. Check if an old userImgUrl exists and is not null or empty
        // 3. If an old image exists, extract the filename and construct the full path
        // 4. Delete the old file
        if (oldUserImgUrl != null && !oldUserImgUrl.isEmpty()) {
            // Assuming oldUserImgUrl is stored as "/images/uniqueFileName.ext"
            // Extract the filename from the URL
            String oldFileName = oldUserImgUrl.substring(oldUserImgUrl.lastIndexOf("/") + 1);
            Path oldFilePath = uploadPath.resolve(oldFileName);
            if (Files.exists(oldFilePath)) {
                try {
                    Files.delete(oldFilePath);
                    System.out.println("Old profile image deleted: " + oldFilePath);
                } catch (IOException e) {
                    System.err.println("Failed to delete old profile image: " + oldFilePath + " - " + e.getMessage());
                    // Log the error but don't prevent the new image from being saved
                }
            }
        }

        return "http://localhost:8080" + userImgUrl; // Return full URL for frontend
    }

    public void requestDeleteAccountCode(String userEmail) throws MessagingException {
        // Generate a random 6-digit code
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // 6-digit code
        String emailCode = String.valueOf(code);

        // Set expiration time
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MILLISECOND, (int) emailVerificationProperties.getExpiration());
        Timestamp verifiTime = new Timestamp(calendar.getTimeInMillis());

        // Save to database
        EmailVerificationVO emailVerificationVO = new EmailVerificationVO();
        emailVerificationVO.setUserEmail(userEmail);
        emailVerificationVO.setEmailCode(emailCode);
        emailVerificationVO.setVerifiTime(verifiTime);
        mypageMapper.insertEmailVerification(emailVerificationVO);

        // Send email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(userEmail);
        helper.setSubject("[LastDance] Account Deletion Verification Code");
        helper.setText("Your account deletion verification code is: " + emailCode + ". This code is valid for " + (emailVerificationProperties.getExpiration() / 60000) + " minutes.", true);
        mailSender.send(message);
    }

    public void deleteAccount(String userId, String emailCode) {
        // First, get the user's email from userId
        UserVO user = mypageMapper.getUserById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found.");
        }
        String userEmail = user.getUserEmail();

        EmailVerificationVO storedVerification = new EmailVerificationVO();
        storedVerification.setUserEmail(userEmail);
        storedVerification.setEmailCode(emailCode);
        storedVerification = mypageMapper.selectEmailVerification(storedVerification);

        if (storedVerification == null) {
            throw new IllegalArgumentException("Invalid or expired verification code.");
        }

        // Check if the code has expired
        if (storedVerification.getVerifiTime().before(new Timestamp(System.currentTimeMillis()))) {
            mypageMapper.deleteEmailVerification(storedVerification); // Delete expired code
            throw new IllegalArgumentException("Verification code has expired.");
        }

        // If verification is successful, proceed with account deletion
        mypageMapper.deleteAccount(userId);
        mypageMapper.deleteEmailVerification(storedVerification); // Delete verification record after successful deletion
    }

}
