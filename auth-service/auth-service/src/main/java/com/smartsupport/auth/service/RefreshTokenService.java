package com.smartsupport.auth.service;

import com.smartsupport.auth.entity.RefreshToken;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(String email);

    RefreshToken verifyRefreshToken(String token);

    void deleteByEmail(String email);
}