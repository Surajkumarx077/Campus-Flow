package com.campusflow.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${campus.flow.admin.email:lnctgroup@gmail.com}")
    private String adminEmail;

    @Value("${campus.flow.admin.password:admin12345}")
    private String adminPassword;

    public AdminSeeder(UserRepository userRepository, RoleRepository roleRepository, PermissionRepository permissionRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new IllegalStateException("ADMIN role is missing"));
        adminRole.getPermissions().addAll(permissionRepository.findAll());
        roleRepository.save(adminRole);
        userRepository.findByEmailIgnoreCase(adminEmail).ifPresentOrElse(
            user -> user.updatePassword(passwordEncoder.encode(adminPassword)),
            () -> userRepository.save(new User(
                adminEmail, passwordEncoder.encode(adminPassword), "LNCT", "Administrator", adminRole)));
    }
}
