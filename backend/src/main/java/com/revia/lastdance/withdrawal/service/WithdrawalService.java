package com.revia.lastdance.withdrawal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WithdrawalService {

    @Autowired
    private WithdrawalDAO withdrawalDAO;

    public boolean deleteUser(String userId) {
        int result = withdrawalDAO.deleteUser(userId);
        return result > 0;
    }
}
