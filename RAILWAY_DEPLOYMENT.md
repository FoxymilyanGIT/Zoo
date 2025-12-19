# Развертывание на Railway

## Быстрый старт

1. **Создайте аккаунт на [Railway.app](https://railway.app)**

2. **Установите Railway CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

3. **Инициализируйте проект:**
   ```bash
   railway init
   ```

4. **Добавьте PostgreSQL базу данных:**
   ```bash
   railway add postgresql
   ```

5. **Настройте переменные окружения:**
   Перейдите в Railway Dashboard → Variables и добавьте:
   ```
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
   JWT_EXPIRATION_SECONDS=3600
   UPLOADS_DIR=uploads
   SPRING_PROFILES_ACTIVE=prod
   ```

6. **Задеплойте:**
   ```bash
   railway up
   ```

## Структура сервисов

Проект автоматически настроен для создания двух сервисов:

### Backend Service
- **Источник:** `backend/` папка
- **Сборка:** Maven (Java 17, Spring Boot)
- **Запуск:** `java -jar target/*.jar`
- **Порт:** 8080
- **Health Check:** `/api/health`

### Frontend Service
- **Источник:** `frontend/` папка
- **Сборка:** `npm run build`
- **Запуск:** nginx с статическими файлами
- **Порт:** 80
- **Health Check:** `/`

## Переменные окружения

### Обязательные:
- `DATABASE_URL` - предоставляется Railway автоматически
- `JWT_SECRET` - секретный ключ для JWT (минимум 32 символа)

### Опциональные:
- `JWT_EXPIRATION_SECONDS` - время жизни токена (3600 по умолчанию)
- `UPLOADS_DIR` - директория для загрузки файлов (uploads по умолчанию)
- `JAVA_OPTS` - опции JVM (-Xmx512m -Xms256m по умолчанию)

## Troubleshooting

### Ошибка "Railpack could not determine how to build the app"
- Убедитесь что в корне есть `railway.toml`
- Проверьте что `start.sh` исполняемый: `chmod +x start.sh`

### Backend не может подключиться к БД
- Проверьте что PostgreSQL добавлен в проект
- Убедитесь что `DATABASE_URL` доступна

### Frontend не может достучаться до API
- Настройте `VITE_API_BASE_URL` в переменных окружения frontend сервиса
- URL должен указывать на backend сервис Railway

### Ошибки сборки
- Backend: проверьте Java 17 compatibility
- Frontend: убедитесь что все зависимости в package.json

## Мониторинг

После развертывания отслеживайте логи:
```bash
railway logs
```

Или через Railway Dashboard → Services → Logs.
