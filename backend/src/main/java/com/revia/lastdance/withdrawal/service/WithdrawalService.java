package com.revia.lastdance.withdrawal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.revia.lastdance.withdrawal.dao.WithdrawalDAO;

@Service
public class WithdrawalService {

    @Autowired
    private WithdrawalDAO withdrawalDAO;

    public boolean deleteUser(String userId) {
        int result = withdrawalDAO.deleteUser(userId);
        return result > 0;
    }
}
