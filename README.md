# 📸 Image Processing Backend Service

This project is a backend system for an image processing service similar to **Cloudinary**. It allows users to register, log in, upload images, apply various transformations (resize, crop, rotate, watermark, etc.), and retrieve them in multiple formats.

---

## 📝 Requirements

- **User Authentication**  
  - Sign-Up: Allow users to create an account.  
  - Log-In: Allow users to log into their account.  
  - JWT Authentication: Secure endpoints using JWTs for authenticated access.

- **Image Management**  
  - Upload Image: Allow users to upload images.  
  - Transform Image: Allow users to perform various transformations (resize, crop, rotate, watermark, flip, mirror, compress, format conversion, filters).  
  - Retrieve Image: Allow users to retrieve a saved image in different formats.  
  - List Images: List all uploaded images by the user with metadata.

- **Image Transformations**  
  - Resize  
  - Crop  
  - Rotate  
  - Flip / Mirror  
  - Watermark  
  - Compress  
  - Change format (JPEG, PNG, etc.)  
  - Apply filters (grayscale, sepia, etc.)  
  - (Feel free to add more)

---

## 🛠️ API Endpoints

### 🔐 Authentication

#### `POST /register`
Register a new user.

**Request Body**
```json
{
  "username": "user1",
  "password": "password123"
}
```

**Response**
```json
{
  "user": { "id": "uuid", "username": "user1" },
  "token": "jwt_token_here"
}
```

---

#### `POST /login`
Log in an existing user.

**Request Body**
```json
{
  "username": "user1",
  "password": "password123"
}
```

**Response**
```json
{
  "user": { "id": "uuid", "username": "user1" },
  "token": "jwt_token_here"
}
```

---

### 🖼️ Image Management

#### `POST /images`
Upload a new image.

- **Headers:** `Authorization: Bearer <JWT>`  
- **Body:** `multipart/form-data` with field `file`

**Response**
```json
{
  "id": "imageId",
  "url": "https://yourdomain.com/images/imageId",
  "metadata": {
    "width": 800,
    "height": 600,
    "format": "jpeg"
  }
}
```

---

#### `POST /images/:id/transform`
Apply one or more transformations to an existing image.

- **Headers:** `Authorization: Bearer <JWT>`  
- **Body Example:**
  ```json
  {
    "transformations": {
      "resize": { "width": 300, "height": 200 },
      "crop":  { "width": 100, "height": 100, "x": 10, "y": 10 },
      "rotate": 90,
      "watermark": { "text": "Sample", "opacity": 0.5, "position": "south-east" },
      "format": "png",
      "filters": { "grayscale": true, "sepia": false }
    }
  }
  ```

**Response**
```json
{
  "url": "https://yourdomain.com/images/imageId?transformed=true",
  "metadata": {
    "width": 300,
    "height": 200,
    "format": "png"
  }
}
```

---

#### `GET /images/:id`
Retrieve an original or transformed image.  
- **Headers:** `Authorization: Bearer <JWT>`  
- **Response:** Returns the binary image data.

---

#### `GET /images`
List all images uploaded by the authenticated user.  
- **Headers:** `Authorization: Bearer <JWT>`

**Response**
```json
[
  {
    "id": "img1",
    "url": "...",
    "metadata": { "width": 800, "height": 600, "format": "jpeg" }
  },
  {
    "id": "img2",
    "url": "...",
    "metadata": { "width": 1024, "height": 768, "format": "png" }
  }
]
```

---

## 🐳 Docker Support

### Dockerfile

```Dockerfile
# Stage 1: Builder
FROM node:22-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:22-slim

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ARG PORT=3000
ENV PORT=$PORT

EXPOSE $PORT
CMD ["node", "dist/index.js"]
```

---

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "${PORT}:${PORT}"
    env_file:
      - .env
    volumes:
      - .env:/app/.env
```

---

## 🧪 Running Locally

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/image-processor-backend.git
   cd image-processor-backend
   ```

2. **Create a `.env` file** in the project root:  
   ```env
   PORT=3000
   JWT_SECRET=your_secret_key
   DATABASE_URL=your_database_url
   ```

3. **Build and launch with Docker Compose**  
   ```bash
   docker-compose up --build
   ```

4. **Access the service** at `http://localhost:3000`

---

## 📂 Directory Structure

```
├── src/
│   ├── auth/
│   ├── images/
│   ├── middleware/
│   └── utils/
├── dist/
├── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

---

## ✅ Future Enhancements

- CDN integration for faster delivery  
- Support for S3 or other cloud storage backends  
- Rate limiting and usage analytics  
- Admin dashboard and user management UI  
- WebSocket support for live processing updates  

---

## 📬 License

Released under the **MIT License**. See [LICENSE](./LICENSE) for details.

---

## ✨ Author

**Vishal** — [GitHub Profile](https://github.com/yourgithub)

