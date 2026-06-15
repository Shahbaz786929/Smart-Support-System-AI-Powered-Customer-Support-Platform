package com.smartsupport.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequest {

    @NotBlank(message="Name cannot be empty")
    private String name;

    @Email(message="Enter valid email")
    @NotBlank(message="Email cannot be empty")
    private String email;

    @Size(
            min=6,
            message="Password must contain minimum 6 characters"
    )
    private String password;

}