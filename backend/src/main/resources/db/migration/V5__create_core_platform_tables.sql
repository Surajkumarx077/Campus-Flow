CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(180) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE roles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT uk_roles_name UNIQUE (name)
);

CREATE TABLE permissions (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT uk_permissions_name UNIQUE (name)
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles (id),
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions (id)
);

CREATE TABLE student_profiles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    student_number VARCHAR(60) NOT NULL,
    department VARCHAR(120),
    year_of_study INT,
    phone VARCHAR(30),
    PRIMARY KEY (id),
    CONSTRAINT uk_student_profiles_user UNIQUE (user_id),
    CONSTRAINT uk_student_profiles_number UNIQUE (student_number),
    CONSTRAINT fk_student_profiles_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE event_categories (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT uk_event_categories_name UNIQUE (name)
);

CREATE TABLE event_organizers (
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (event_id, user_id),
    CONSTRAINT fk_event_organizers_event FOREIGN KEY (event_id) REFERENCES events (id),
    CONSTRAINT fk_event_organizers_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE event_schedules (
    id BIGINT NOT NULL AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    title VARCHAR(180) NOT NULL,
    venue VARCHAR(180),
    PRIMARY KEY (id),
    CONSTRAINT fk_event_schedules_event FOREIGN KEY (event_id) REFERENCES events (id),
    INDEX idx_event_schedules_event (event_id)
);

CREATE TABLE event_venues (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(180) NOT NULL,
    address VARCHAR(255),
    capacity INT,
    PRIMARY KEY (id),
    CONSTRAINT uk_event_venues_name UNIQUE (name)
);

CREATE TABLE event_documents (
    id BIGINT NOT NULL AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    content_type VARCHAR(120),
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_event_documents_event FOREIGN KEY (event_id) REFERENCES events (id)
);

CREATE TABLE registration_forms (
    id BIGINT NOT NULL AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    title VARCHAR(180) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    PRIMARY KEY (id),
    CONSTRAINT uk_registration_forms_event UNIQUE (event_id),
    CONSTRAINT fk_registration_forms_event FOREIGN KEY (event_id) REFERENCES events (id)
);

CREATE TABLE registration_form_fields (
    id BIGINT NOT NULL AUTO_INCREMENT,
    form_id BIGINT NOT NULL,
    field_key VARCHAR(80) NOT NULL,
    label VARCHAR(180) NOT NULL,
    field_type VARCHAR(40) NOT NULL,
    required_flag BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_registration_form_fields_form FOREIGN KEY (form_id) REFERENCES registration_forms (id),
    CONSTRAINT uk_registration_form_fields_key UNIQUE (form_id, field_key)
);

CREATE TABLE registration_answers (
    id BIGINT NOT NULL AUTO_INCREMENT,
    registration_id BIGINT NOT NULL,
    field_id BIGINT NOT NULL,
    answer_value TEXT,
    PRIMARY KEY (id),
    CONSTRAINT fk_registration_answers_registration FOREIGN KEY (registration_id) REFERENCES registrations (id),
    CONSTRAINT fk_registration_answers_field FOREIGN KEY (field_id) REFERENCES registration_form_fields (id),
    CONSTRAINT uk_registration_answers_field UNIQUE (registration_id, field_id)
);

CREATE TABLE teams (
    id BIGINT NOT NULL AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    name VARCHAR(120) NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_teams_event FOREIGN KEY (event_id) REFERENCES events (id),
    CONSTRAINT uk_teams_event_name UNIQUE (event_id, name)
);

CREATE TABLE team_members (
    team_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (team_id, user_id),
    CONSTRAINT fk_team_members_team FOREIGN KEY (team_id) REFERENCES teams (id),
    CONSTRAINT fk_team_members_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE waitlist_entries (
    id BIGINT NOT NULL AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    position_number INT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'WAITING',
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_waitlist_entries_event FOREIGN KEY (event_id) REFERENCES events (id),
    CONSTRAINT fk_waitlist_entries_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT uk_waitlist_entries_event_user UNIQUE (event_id, user_id),
    CONSTRAINT uk_waitlist_entries_event_position UNIQUE (event_id, position_number)
);

INSERT INTO roles (name, description) VALUES
    ('STUDENT', 'College student'),
    ('ORGANIZER', 'Event organizer'),
    ('ADMIN', 'College administrator'),
    ('VOLUNTEER', 'Event volunteer'),
    ('JUDGE', 'Competition judge');

INSERT INTO permissions (name, description) VALUES
    ('EVENT_CREATE', 'Create events'),
    ('EVENT_APPROVE', 'Approve events'),
    ('REGISTRATION_VIEW', 'View registrations'),
    ('PAYMENT_REFUND', 'Process payment refunds'),
    ('RESULT_PUBLISH', 'Publish event results'),
    ('ANALYTICS_VIEW', 'View analytics');

INSERT INTO event_categories (name, description) VALUES
    ('Technology', 'Hackathons and technology events'),
    ('Cultural', 'Cultural and performing arts events'),
    ('Sports', 'Sports competitions'),
    ('Workshop', 'Workshops and practical sessions'),
    ('Seminar', 'Seminars and talks');
