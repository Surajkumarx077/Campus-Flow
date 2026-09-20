CREATE TABLE registrations (
    id BIGINT NOT NULL AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    student_name VARCHAR(140) NOT NULL,
    student_email VARCHAR(180) NOT NULL,
    status VARCHAR(40) NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_registrations_event FOREIGN KEY (event_id) REFERENCES events (id),
    CONSTRAINT uk_registration_event_email UNIQUE (event_id, student_email),
    INDEX idx_registrations_email (student_email)
);
