# Как запустить Live Chat локально

## 1️⃣ Запуск Backend

Открой первый терминал и выполни:

```bash
cd /Users/egorkazabey/Projects/music-finder/backend
npm run start:dev
```

Ожидай вывода:
```
🚀 Server is running on http://0.0.0.0:3000
```

## 2️⃣ Запуск Frontend

Открой второй терминал и выполни:

```bash
cd /Users/egorkazabey/Projects/music-finder/frontend
npm run dev
```

Ожидай вывода:
```
➜  Local:   http://localhost:5173/
```

## 3️⃣ Открой в браузере

Перейди на: **http://localhost:5173**

## 4️⃣ Использование

1. Нажми на "Live Chat" в меню
2. Введи свое имя (например "User1")
3. Пиши сообщения

---

## Для других пользователей в сети

Если кто-то другой хочет подключиться, они должны открыть:

```
http://10.101.0.65:5173
```

(где `10.101.0.65` - это IP твоего компьютера)

---

## Остановка серверов

Нажми `Ctrl+C` в каждом терминале где запущены серверы.

---

## Команды быстро

```bash
# Terminal 1
cd ~/Projects/music-finder/backend && npm run start:dev

# Terminal 2  
cd ~/Projects/music-finder/frontend && npm run dev
```

Затем открой http://localhost:5173 в браузере.
