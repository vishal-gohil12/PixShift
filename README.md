# 📸 Image Processing Backend Service

This project is a backend system for an image processing service similar to **Cloudinary**. It allows users to register, log in, upload images, apply various transformations (resize, crop, rotate, watermark, etc.), and retrieve them in multiple formats. Images are stored and served via [Cloudinary](https://cloudinary.com) for scalable, secure management.

---

## 📝 Requirements

- **User Authentication**  
  - Sign-Up: Allow users to create an account.  
  - Log-In: Allow users to log into their account.  
  - JWT Authentication: Secure endpoints using JWTs for authenticated access.

- **Image Storage**  
  - Use **Cloudinary** to store uploaded images and manage transformations efficiently.

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

---

## 🛠️ API Endpoints

### 🔐 Authentication

#### `POST /register`
Register a new user.

**Request Body**
```json
{
  "username": "abc",
  "password": "abc"
}
```

**Response**
```json
{
  "status": true,
  "message": "User created successfully.",
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
  "status": true,
  "message": "Login successful.",
  "token": "jwt_token_here"
}
```

---

### 🖼️ Image Management

> **Note:** Images are uploaded to and stored in Cloudinary. The `file.path` returned by multer should be configured to return the Cloudinary URL, and `file.filename` as the Cloudinary public ID.

#### `POST /images`
Upload a new image.

- **Headers:** `Authorization: Bearer <JWT>`  
- **Body:** `multipart/form-data` with field `file`

**Response**
```json
{
  "success": true,
  "image": {
    "_id": "imageId",
    "user": "userId",
    "originalUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/v167xxx/image.jpg",
    "cloudinaryId": "public_id_here",
    "createdAt": "2025-04-22T17:49:23.000Z",
    "updatedAt": "2025-04-22T17:49:23.000Z"
  }
}
```

---

#### `GET /images`
List all images uploaded by the authenticated user.

- **Headers:** `Authorization: Bearer <JWT>`

**Response**
```json
{
  "success": true,
  "images": [
    {
      "_id": "img1",
      "user": "userId",
      "originalUrl": "https://res.cloudinary.com/.../img1.jpg",
      "cloudinaryId": "public_id_1",
      "createdAt": "2025-04-22T17:49:23.000Z",
      "updatedAt": "2025-04-22T17:49:23.000Z"
    },
    {
      "_id": "img2",
      "user": "userId",
      "originalUrl": "https://res.cloudinary.com/.../img2.png",
      "cloudinaryId": "public_id_2",
      "createdAt": "2025-04-22T17:49:23.000Z",
      "updatedAt": "2025-04-22T17:49:23.000Z"
    }
  ]
}
```

---

#### `GET /images/:id`
Retrieve a single image record.

- **Headers:** `Authorization: Bearer <JWT>`

**Response**
```json
{
  "success": true,
  "image": {
    "_id": "imageId",
    "user": "userId",
    "originalUrl": "https://res.cloudinary.com/.../image.jpg",
    "cloudinaryId": "public_id",
    "createdAt": "2025-04-22T17:49:23.000Z",
    "updatedAt": "2025-04-22T17:49:23.000Z"
  }
}
```

---

#### `POST /images/:id/transform`
Apply one or more transformations to an existing image. Responds with binary image data.

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

**Response:**
- Content-Type header set to `image/{format}` (e.g., `image/png`)
- Binary image buffer streamed in response body

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
   git clone https://github.com/vishal-gohil12/PixShift.git
   cd PixShift
   ```

2. **Create a `.env` file** in the project root:  
   ```env
   PORT=3000
   JWT_SECRET=your_secret_key
   DATABASE_URL=your_database_url
   CLOUDINARY_CLOUD_NAME=""
    CLOUDINARY_API_KEY=""
    CLOUDINARY_API_SECRET=""
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
│   ├── model/
│   ├── route/
│   ├── controller/
│   ├── middleware/
│   ├── config/
│   ├── types/
│   └── index.ts
├── dist/
├── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

---

## ✨ Author

**Vishal** — [GitHub Profile](https://github.com/vishal-gohil12)

