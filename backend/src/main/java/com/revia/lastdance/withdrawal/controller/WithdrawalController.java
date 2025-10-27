package com.revia.lastdance.withdrawal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.revia.lastdance.withdrawal.service.WithdrawalService;

@RestController
@RequestMapping("/api/user")
public class WithdrawalController {

    @Autowired
    private WithdrawalService withdrawalService;

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        boolean deleted = withdrawalService.deleteUser(userId);
        if (deleted) {
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found or could not be deleted", HttpStatus.NOT_FOUND);
        }
    }
}
