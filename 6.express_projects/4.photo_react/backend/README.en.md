
# Express API Test Guide

This document provides `curl` commands to test the API endpoints for the Express server.

---

## 1. Fetch All Posts (`GET /api/posts`)

### Linux Command
```bash
curl -X GET http://localhost:3000/api/posts
```

### Windows Command (CMD)
```cmd
curl -X GET http://localhost:3000/api/posts
```

- **Description**: Retrieves all stored posts.
- **Result**: List of posts in JSON format.

---

## 2. Create a New Post (`POST /api/posts`)

### Text Post Only
#### Linux Command
```bash
curl -X POST http://localhost:3000/api/posts \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Test Title",
        "content": "Test Content"
    }'
```

#### Windows Command (CMD)
```cmd
curl -X POST http://localhost:3000/api/posts -H "Content-Type: application/json" -d "{\"title\": \"Test Title\", \"content\": \"Test Content\"}"
```

- **Description**: Creates a new post with a title and content only (no image).

---

### Post with Image Upload
#### Linux Command
```bash
curl -X POST http://localhost:3000/api/posts \
    -H "Content-Type: multipart/form-data" \
    -F "title=Test Title" \
    -F "content=Test Content" \
    -F "photo=@/path/to/image.jpg"
```

#### Windows Command (CMD)
```cmd
curl -X POST http://localhost:3000/api/posts -H "Content-Type: multipart/form-data" -F "title=Test Title" -F "content=Test Content" -F "photo=@C:\path\to\image.jpg"
```

- **Description**: Creates a new post with a title, content, and an image.
- **Note**: Replace `/path/to/image.jpg` (Linux) or `C:\path\to\image.jpg` (Windows) with the actual image file path.

---

## 3. View an Image (`GET /api/images/:filename`)

### Linux Command
```bash
curl -X GET http://localhost:3000/api/images/<filename> --output output.jpg
```

### Windows Command (CMD)
```cmd
curl -X GET http://localhost:3000/api/images/<filename> --output output.jpg
```

- **Description**: Downloads the specified image file.
- **Note**: Replace `<filename>` with the actual file name (e.g., `photo_1691234567890.jpg`).
- **Result**: The image will be saved as `output.jpg`.

---

## 4. Delete a Post (`DELETE /api/posts/:index`)

### Linux Command
```bash
curl -X DELETE http://localhost:3000/api/posts/1
```

### Windows Command (CMD)
```cmd
curl -X DELETE http://localhost:3000/api/posts/1
```

- **Description**: Deletes the post at the specified index (e.g., `1` for the first post).

---

## Example Workflow

1. Fetch all posts (initial state):
   - Linux: `curl -X GET http://localhost:3000/api/posts`
   - Windows: `curl -X GET http://localhost:3000/api/posts`

2. Create a new post with an image:
   - Linux:
     ```bash
     curl -X POST http://localhost:3000/api/posts \
         -H "Content-Type: multipart/form-data" \
         -F "title=Test Title" \
         -F "content=Test Content" \
         -F "photo=@/path/to/image.jpg"
     ```
   - Windows:
     ```cmd
     curl -X POST http://localhost:3000/api/posts -H "Content-Type: multipart/form-data" -F "title=Test Title" -F "content=Test Content" -F "photo=@C:\path\to\image.jpg"
     ```

3. Fetch all posts again to verify:
   - Linux: `curl -X GET http://localhost:3000/api/posts`
   - Windows: `curl -X GET http://localhost:3000/api/posts`

4. Delete a post:
   - Linux: `curl -X DELETE http://localhost:3000/api/posts/1`
   - Windows: `curl -X DELETE http://localhost:3000/api/posts/1`

---

Replace paths and filenames as appropriate for your environment. Use the provided commands to verify the API functionality.
