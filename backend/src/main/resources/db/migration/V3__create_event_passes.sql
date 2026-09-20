CREATE TABLE event_passes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    registration_id BIGINT NOT NULL,
    token VARCHAR(36) NOT NULL,
    issued_at DATETIME NOT NULL,
    checked_in_at DATETIME NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_event_passes_registration FOREIGN KEY (registration_id) REFERENCES registrations (id),
    CONSTRAINT uk_event_passes_registration UNIQUE (registration_id),
    CONSTRAINT uk_event_passes_token UNIQUE (token)
);
