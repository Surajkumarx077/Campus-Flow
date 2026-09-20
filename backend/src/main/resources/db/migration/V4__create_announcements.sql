CREATE TABLE announcements (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(180) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    audience VARCHAR(80) NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_announcements_created_at (created_at)
);
