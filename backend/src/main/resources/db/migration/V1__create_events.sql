CREATE TABLE events (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(180) NOT NULL,
    category VARCHAR(80) NOT NULL,
    venue VARCHAR(180) NOT NULL,
    event_date DATE NOT NULL,
    status VARCHAR(40) NOT NULL,
    registrations INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_events_event_date (event_date),
    INDEX idx_events_status (status)
);
