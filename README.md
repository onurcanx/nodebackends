# Film Yorum Analizi - Node.js Backend

Bu proje, film yorumlarını analiz eden ve kullanıcıların film deneyimlerini paylaşabilecekleri web uygulamasının Node.js backend kısmıdır.

## Özellikler

- Kullanıcı kimlik doğrulama ve yetkilendirme
- Film veritabanı yönetimi
- Yorum yönetimi
- Python backend ile entegrasyon

## Teknolojiler

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Axios

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Çevre değişkenlerini ayarlayın:
`.env` dosyası oluşturun ve aşağıdaki değişkenleri tanımlayın:
```
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
PYTHON_BACKEND_URL=http://localhost:5000
```

3. Sunucuyu başlatın:
```bash
npm start
```

## API Endpoints

### Kimlik Doğrulama
- `POST /api/auth/register`
  - Yeni kullanıcı kaydı
- `POST /api/auth/login`
  - Kullanıcı girişi

### Filmler
- `GET /api/movies`
  - Film listesi
- `POST /api/movies`
  - Yeni film ekleme
- `GET /api/movies/:id`
  - Film detayları

### Yorumlar
- `POST /api/comments`
  - Yeni yorum ekleme
- `GET /api/comments/movie/:movieId`
  - Filme ait yorumları getirme

## Python Backend İletişimi

Node.js backend, yorum analizi için Python backend ile iletişim kurar. Python backend'in çalışır durumda olduğundan emin olun.

## Lisans

MIT 