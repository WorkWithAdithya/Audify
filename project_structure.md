# 📁 Audify - Project Structure

*Generated on: 7/19/2026, 9:23:50 PM*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 100 |
| 📁 Total Folders | 18 |
| 🌳 Max Depth | 3 levels |
| 🛠️ Tech Stack | React, TypeScript, CSS, Node.js, Docker |

## ⭐ Important Files

- 🟡 🐳 **Dockerfile** - Docker container
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔷 **tsconfig.json** - TypeScript config
- 🟡 🚫 **.gitignore** - Git ignore rules
- 🟡 🐳 **Dockerfile** - Docker container
- 🔴 📖 **README.md** - Project documentation
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔷 **tsconfig.json** - TypeScript config
- 🟡 🐳 **Dockerfile** - Docker container
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔷 **tsconfig.json** - TypeScript config
- 🔴 📖 **README.md** - Project documentation
- 🟡 🐳 **Dockerfile** - Docker container
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔷 **tsconfig.json** - TypeScript config
- 🟡 🐳 **Dockerfile** - Docker container
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔷 **tsconfig.json** - TypeScript config
- 🟡 🐳 **docker-compose.yml** - Docker compose
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration

## 📊 File Statistics

### By File Type

- 🔷 **.ts** (TypeScript files): 26 files (26.0%)
- ⚛️ **.tsx** (React TypeScript files): 24 files (24.0%)
- ⚙️ **.json** (JSON files): 19 files (19.0%)
- 🖼️ **.png** (PNG images): 9 files (9.0%)
- 🐳 **.dockerignore** (Docker ignore): 5 files (5.0%)
- 🐳 **.dockerfile** (Docker files): 5 files (5.0%)
- 📜 **.js** (JavaScript files): 3 files (3.0%)
- 📖 **.md** (Markdown files): 2 files (2.0%)
- 🎨 **.svg** (SVG images): 2 files (2.0%)
- 🚫 **.gitignore** (Git ignore): 1 files (1.0%)
- 🌐 **.html** (HTML files): 1 files (1.0%)
- 🎨 **.css** (Stylesheets): 1 files (1.0%)
- ⚙️ **.yml** (YAML files): 1 files (1.0%)
- ⚙️ **.yaml** (YAML files): 1 files (1.0%)

### By Category

- **TypeScript**: 26 files (26.0%)
- **React**: 24 files (24.0%)
- **Config**: 21 files (21.0%)
- **DevOps**: 11 files (11.0%)
- **Assets**: 11 files (11.0%)
- **JavaScript**: 3 files (3.0%)
- **Docs**: 2 files (2.0%)
- **Web**: 1 files (1.0%)
- **Styles**: 1 files (1.0%)

### 📁 Largest Directories

- **root**: 100 files
- **Frontend**: 48 files
- **Frontend/src**: 26 files
- **Admin-service**: 12 files
- **Payment-service**: 12 files

## 🌳 Directory Structure

```
Audify/
├── 📂 Admin-service/
│   ├── 🐳 .dockerignore
│   ├── 🟡 🐳 **Dockerfile**
│   ├── 🟡 🔒 **package-lock.json**
│   ├── 🔴 📦 **package.json**
│   ├── 📁 src/
│   │   ├── ⚙️ config/
│   │   │   ├── 🔷 dataUri.ts
│   │   │   └── 🔷 db.ts
│   │   ├── 🔷 controller.ts
│   │   ├── 🔷 index.ts
│   │   ├── 🔷 middleware.ts
│   │   ├── 🔷 route.ts
│   │   └── 🔷 TryCatch.ts
│   └── 🟡 🔷 **tsconfig.json**
├── 🟡 🐳 **docker-compose.yml**
├── 📂 Frontend/
│   ├── 🐳 .dockerignore
│   ├── 🟡 🚫 **.gitignore**
│   ├── 🟡 🐳 **Dockerfile**
│   ├── 📜 eslint.config.js
│   ├── 🌐 index.html
│   ├── 🟡 🔒 **package-lock.json**
│   ├── 🔴 📦 **package.json**
│   ├── 🌐 public/
│   │   ├── 🖼️ arrow.png
│   │   ├── 🖼️ home.png
│   │   ├── 🖼️ left_arrow.png
│   │   ├── 🖼️ logo.png
│   │   ├── 🖼️ playlist.png
│   │   ├── 🖼️ plus.png
│   │   ├── 🖼️ right_arrow.png
│   │   ├── 🖼️ search.png
│   │   ├── 🖼️ stack.png
│   │   └── 🎨 vite.svg
│   ├── 🔴 📖 **README.md**
│   ├── 📁 src/
│   │   ├── ⚛️ App.tsx
│   │   ├── 📦 assets/
│   │   │   └── 🎨 react.svg
│   │   ├── 🧩 components/
│   │   │   ├── ⚛️ AlbumCard.tsx
│   │   │   ├── ⚛️ CartItem.tsx
│   │   │   ├── ⚛️ Layout.tsx
│   │   │   ├── ⚛️ Loading.tsx
│   │   │   ├── ⚛️ Navbar.tsx
│   │   │   ├── ⚛️ Player.tsx
│   │   │   ├── ⚛️ PlayListCard.tsx
│   │   │   ├── ⚛️ Sidebar.tsx
│   │   │   └── ⚛️ SongCard.tsx
│   │   ├── 📂 context/
│   │   │   ├── ⚛️ CartContext.tsx
│   │   │   ├── ⚛️ PaymentContext.tsx
│   │   │   ├── ⚛️ SongContext.tsx
│   │   │   └── ⚛️ UserContext.tsx
│   │   ├── 🎨 index.css
│   │   ├── ⚛️ main.tsx
│   │   └── 📄 pages/
│   │   │   ├── ⚛️ Admin.tsx
│   │   │   ├── ⚛️ Album.tsx
│   │   │   ├── ⚛️ Cart.tsx
│   │   │   ├── ⚛️ Home.tsx
│   │   │   ├── ⚛️ Login.tsx
│   │   │   ├── ⚛️ MyPurchases.tsx
│   │   │   ├── ⚛️ PlayList.tsx
│   │   │   ├── ⚛️ Register.tsx
│   │   │   └── ⚛️ SongDetail.tsx
│   ├── ⚙️ tsconfig.app.json
│   ├── 🟡 🔷 **tsconfig.json**
│   ├── ⚙️ tsconfig.node.json
│   └── 🔷 vite.config.ts
├── ⚙️ kubernetes-manifest.yaml
├── 🟡 🔒 **package-lock.json**
├── 🔴 📦 **package.json**
├── 📂 Payment-service/
│   ├── 🐳 .dockerignore
│   ├── 🟡 🐳 **Dockerfile**
│   ├── 🟡 🔒 **package-lock.json**
│   ├── 🔴 📦 **package.json**
│   ├── 📁 src/
│   │   ├── ⚙️ config/
│   │   │   └── 🔷 db.ts
│   │   ├── 🔷 controller.ts
│   │   ├── 🔷 index.ts
│   │   ├── 🔷 middleware.ts
│   │   ├── 🔷 route.ts
│   │   ├── 📜 test-razorpay.js
│   │   └── 🔷 TryCatch.ts
│   └── 🟡 🔷 **tsconfig.json**
├── 🔴 📖 **README.md**
├── 📂 Song service1/
│   ├── 🐳 .dockerignore
│   ├── 🟡 🐳 **Dockerfile**
│   ├── 🟡 🔒 **package-lock.json**
│   ├── 🔴 📦 **package.json**
│   ├── 📁 src/
│   │   ├── ⚙️ config/
│   │   │   └── 🔷 db.ts
│   │   ├── 🔷 controller.ts
│   │   ├── 🔷 index.ts
│   │   ├── 🔷 middleware.ts
│   │   ├── 🔷 route.ts
│   │   └── 🔷 TryCatch.ts
│   └── 🟡 🔷 **tsconfig.json**
├── 📜 test.js
└── 📂 User-service/
│   ├── 🐳 .dockerignore
│   ├── 🟡 🐳 **Dockerfile**
│   ├── 🟡 🔒 **package-lock.json**
│   ├── 🔴 📦 **package.json**
│   ├── 📁 src/
│   │   ├── 🔷 controller.ts
│   │   ├── 🔷 index.ts
│   │   ├── 🔷 middleware.ts
│   │   ├── 🔷 model.ts
│   │   ├── 🔷 route.ts
│   │   └── 🔷 trycatch.ts
│   └── 🟡 🔷 **tsconfig.json**
```

## 📖 Legend

### File Types
- 🐳 DevOps: Docker ignore
- 🐳 DevOps: Docker files
- ⚙️ Config: JSON files
- 🔷 TypeScript: TypeScript files
- 🚫 DevOps: Git ignore
- 📖 Docs: Markdown files
- 📜 JavaScript: JavaScript files
- 🌐 Web: HTML files
- 🖼️ Assets: PNG images
- 🎨 Assets: SVG images
- ⚛️ React: React TypeScript files
- 🎨 Styles: Stylesheets
- ⚙️ Config: YAML files
- ⚙️ Config: YAML files

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
