# Railway Environment Variables for ZooPark Application

Переменные окружения, которые нужно настроить в Railway Dashboard:

## Backend Variables:
- `JWT_SECRET`: Секретный ключ для JWT токенов (минимум 32 символа)
- `JWT_EXPIRATION_SECONDS`: Время жизни токена в секундах (по умолчанию 3600)
- `UPLOADS_DIR`: Директория для загрузки файлов (по умолчанию "uploads")
- `SPRING_PROFILES_ACTIVE`: Профиль Spring (prod)
- `JAVA_OPTS`: Опции JVM (-Xmx512m -Xms256m)

## Database:
Railway автоматически предоставит `DATABASE_URL` при подключении PostgreSQL базы данных.

## Frontend Variables:
- `VITE_API_BASE_URL`: URL backend API (например: https://your-backend-service.railway.app)

## Настройка в Railway:

1. Создайте новый проект в Railway
2. Добавьте PostgreSQL базу данных
3. Создайте два сервиса:
   - Backend (из папки `backend/`)
   - Frontend (из папки `frontend/`)
4. Настройте переменные окружения в каждом сервисе
5. Для frontend настройте `VITE_API_BASE_URL` указывающим на backend сервис
