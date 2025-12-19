-- Базовая схема БД для ZooPark

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE animals (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(255) NOT NULL,
    zone VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    image_urls TEXT
);

CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    capacity INT NOT NULL,
    booked_count INT NOT NULL DEFAULT 0,
    type VARCHAR(255),
    meta TEXT
);

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    event_id BIGINT REFERENCES events(id),
    created_at TIMESTAMPTZ NOT NULL,
    paid BOOLEAN NOT NULL
);

CREATE TABLE favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    animal_id BIGINT NOT NULL REFERENCES animals(id)
);

CREATE INDEX idx_animals_species ON animals(species);
CREATE INDEX idx_animals_zone ON animals(zone);
CREATE INDEX idx_animals_status ON animals(status);

CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_type ON events(type);

-- Seed: 10 животных

INSERT INTO animals (name, species, zone, status, description, image_urls) VALUES ('Лев африканский', 'Panthera leo', 'Саванна', 'active', 'Главный хищник саванны, живет в просторном вольере.', '["/uploads/lion1.jpg","/uploads/lion2.jpg"]');
INSERT INTO animals (name, species, zone, status, description, image_urls) VALUES ('Тигр амурский', 'Panthera tigris altaica', 'Таёжная зона', 'active', 'Редкий вид тигра, занесен в Красную книгу.', '["/uploads/tiger1.jpg"]');
INSERT INTO animals (name, species, zone, status, description, image_urls) VALUES ('Жираф', 'Giraffa camelopardalis', 'Саванна', 'active', 'Высокий жираф с обзором на весь зоопарк.', '["/uploads/giraffe1.jpg"]');
INSERT INTO animals (name, species, zone, status, description, image_urls) VALUES ('Слон африканский', 'Loxodonta africana', 'Саванна', 'active', 'Крупнейшее сухопутное животное.', '["/uploads/elephant1.jpg"]');
INSERT INTO animals (name, species, zone, status, description, image_urls) VALUES ('Пингвин', 'Aptenodytes forsteri', 'Антарктика', 'active', 'Колония забавных пингвинов.', '["/uploads/penguin1.jpg"]');
INSERT INTO animals (name, species, zone, status, description, image_urls) VALUES ('Фламинго', 'Phoenicopterus', 'Лагуна', 'active', 'Розовые фламинго в мелководной лагуне.', '["/uploads/flamingo1.jpg"]');
INSERT INTO animals (name, species, zone, status, description, image_urls) VALUES ('Енот', 'Procyon lotor', 'Лес', 'active', 'Очень любопытный енот.', '["/uploads/raccoon1.jpg"]');
INSERT INTO animals (name, species, zone, status, description, image_urls) VALUES ('Панда красная', 'Ailurus fulgens', 'Горный лес', 'active', 'Небольшая красная панда, любимец посетителей.', '["/uploads/redpanda1.jpg"]');
INSERT INTO animals (name, species, zone, status, description, image_urls) VALUES ('Кенгуру', 'Macropus', 'Австралия', 'active', 'Стадо прыгучих кенгуру.', '["/uploads/kangaroo1.jpg"]');
INSERT INTO animals (name, species, zone, status, description, image_urls) VALUES ('Зебра', 'Equus quagga', 'Саванна', 'active', 'Зебры с характерными полосками.', '["/uploads/zebra1.jpg"]');

-- Seed: несколько новостей

INSERT INTO news (title, content, published_at) VALUES ('Открытие нового вольера с красными пандами', 'Мы открыли новый просторный вольер для красных панд. Приходите знакомиться!', NOW() - INTERVAL '5 days');
INSERT INTO news (title, content, published_at) VALUES ('Ночь в зоопарке', 'Специальное мероприятие: экскурсии по зоопарку ночью, только по предварительной записи.', NOW() - INTERVAL '2 days');

-- Seed: 3 события

INSERT INTO events (title, description, start_time, end_time, capacity, booked_count, type, meta) VALUES ('Кормление львов', 'Узнайте, как живут и питаются наши львы. Встреча с смотрителем, вопросы и ответы.', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 1 hour', 20, 0, 'feeding', '{"location":"Саванна","age_limit":"6+"}');
INSERT INTO events (title, description, start_time, end_time, capacity, booked_count, type, meta) VALUES ('Экскурсия для детей', 'Интерактивная экскурсия по зоопарку для детей от 5 до 12 лет.', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 2 hours', 30, 0, 'tour', '{"guide":"Анна","language":"ru"}');
INSERT INTO events (title, description, start_time, end_time, capacity, booked_count, type, meta) VALUES ('Фотодень в зоопарке', 'Специальный день для фотографов с доступом к лучшим точкам обзора.', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 3 hours', 50, 0, 'special', '{"tripod_allowed":true}');
