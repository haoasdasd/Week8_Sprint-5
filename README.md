# 📚 **Tài Liệu Hướng Dẫn Quy Tắc Viết Mã Dự Án**

---

## 📖 **Giới thiệu**

Tài liệu này hướng dẫn chi tiết quy tắc viết mã, cấu trúc thư mục và tiêu chuẩn đặt tên cho dự án. Hướng dẫn phù hợp với các dự án sử dụng **Node.js**, **React (TypeScript)** và **pnpm** để đảm bảo chất lượng, khả năng mở rộng và dễ bảo trì.

---

## ⚙️ **Thiết lập môi trường**

### 🔧 **Phiên bản yêu cầu:**

- **Node.js:** v20.17.0
- **pnpm:** v9.9.0
- **Trình duyệt hỗ trợ:** Chrome, Firefox, Edge (phiên bản mới nhất)

### 💻 **Hướng dẫn cài đặt**

#### 🔵 **Trên Windows:**

```bash
choco install nodejs-lts
```

#### 🍏 **Trên macOS:**

```bash
brew install node@20
```

#### 🐧 **Trên Linux (Ubuntu/Debian):**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 📦 **Cài đặt pnpm**

```bash
npm install -g pnpm@9.9.0
```

### 🚀 **Khởi chạy dự án**

```bash
pnpm install
pnpm dev
```

---

## 📂 **Cấu trúc thư mục & Quy tắc đặt tên**

### 🔠 **Quy tắc chung:**

- **Thư mục:** `kebab-case`, số nhiều.
- **File:** `kebab-case` (ví dụ: `user-profile.ts`).
- **Component:** PascalCase (ví dụ: `UserProfile`).
- **Hook:** `use-xyz` (ví dụ: `use-user-profile`).
- **Page:** `page-name-page.tsx` (ví dụ: `welcome-page.tsx`).
- **Layout:** `layout-name-layout.tsx` (ví dụ: `main-layout.tsx`).
- **Utils:** `[functionality].util.ts` (ví dụ: `format.util.ts`).
- **Libs:** `[functionality].lib.ts` (ví dụ: `format-string.lib.ts`).

### 📁 **Cấu trúc thư mục chi tiết và giải thích:**

```
├── src/
│   └── app/
│       ├── apis/
│       │   └── users/
│       │       ├── command/
│       │       └── query/
│       │
│       ├── assets/
│       │   ├── images/
│       │   └── svgs/
│       │
│       ├── components/
│       │   └── my-button-component/
│       │       ├── my-button-component.tsx
│       │       ├── my-button-component.module.scss
│       │       └── index.ts
│       │
│       ├── configs/
│       │   ├── *.config.ts
│       │
│       ├── constants/
│       │   └── file.constant.ts
│       │
│       ├── errors/
│       │   └── error-boundary-handlers.tsx  # Xử lý boundary
│       │
│       ├── hooks/
│       │   └── use-responsive.tsx
│       │
│       ├── layouts/
│       │   └── main-layout/
│       │       ├── main-layout.tsx
│       │       ├── main-layout.module.scss
│       │       └── index.ts
│       │
│       ├── pages/
│       │   ├── welcome-page/
│       │   │   ├── welcome-page.tsx
│       │   │   ├── welcome-page.module.scss
│       │   │   └── index.ts
│       │
│       ├── routes/
│       │   └── app-route.tsx
│       │
│       ├── shared/
│       │   └── user-example.shared.ts
│       │
│       ├── types/
│       │   ├── icons/
│       │   │   ├── requests/icon.type.ts
│       │   │   └── responses/icon.type.ts
│       │
│       ├── utils/
│       │   ├── api.util.ts
│       │   ├── format.util.ts
│       │   └── string.util.ts
│       │
│       └── query-client.ts
│
└── App.tsx
```

### 📝 **Giải thích chi tiết:**

- **apis/**: Chia thành `command` và `query`. File kết thúc bằng `.command.api.ts` hoặc `.query.api.ts`.
- **assets/**: Tên file `kebab-case`, thư mục con `images`, `svgs`.
- **components/**: Mỗi component trong thư mục riêng, SCSS kèm theo, `index.ts` để export. Kết thúc bằng `-component.tsx`
- **configs/**: Tất cả file cấu hình kết thúc bằng `.config.ts`.
- **constants/**: Hằng số dùng chung, kết thúc `.constant.ts`.
- **errors/**: Quản lý các file xử lý lỗi.
- **hooks/**: Custom hook, bắt đầu bằng `use`.
- **layouts/**: Layout chính, SCSS cùng tên, `index.ts` để export. Kết thúc bằng `-layout.tsx`
- **pages/**: Mỗi trang có thư mục riêng, file chính `page-name.tsx`. Kết thúc bằng `-page.tsx`
- **routes/**: Cấu hình router tập trung. Kết thúc bằng `-route.ts``
- **shared/**: Mã dùng chung. Kết thúc bằng `shared.ts`
- **types/**: Interface và type, PascalCase, tách biệt request/response. Kết thúc bằng `.type.ts`
- **utils/**: Hàm tiện ích, kết thúc `.util.ts`.

---

## 🛡️ **Cấu hình ESLint & Quy tắc clean code**

### ⚡ **Cấu hình ESLint:**

```javascript
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
    },
    settings: {
        react: { version: 'detect' },
        'import/resolver': { typescript: {} }
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended'
    ],
    plugins: ['react', 'react-hooks', '@typescript-eslint', 'import', 'jsx-a11y', 'prettier'],
    rules: {
        'no-undef': 'error',
        '@typescript-eslint/no-require-imports': 'error',
        'prettier/prettier': 'warn',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'react-hooks/rules-of-hooks': 'error',
        'jsx-a11y/anchor-is-valid': 'warn'
    }
}
```

### 📝 **Các quy tắc ESLint quan trọng và cách tránh cảnh báo:**

- ⚡ **`no-undef`**: Không sử dụng biến chưa khai báo.
- ⚡ **`@typescript-eslint/no-explicit-any`**: Tránh dùng `any`, khai báo kiểu dữ liệu rõ ràng.
- ⚡ **`@typescript-eslint/no-unused-vars`**: Xóa biến không sử dụng hoặc thêm `_` trước biến.
- ⚡ **`react-hooks/rules-of-hooks`**: Gọi hook đúng vị trí.
- ⚡ **`prettier/prettier`**: Đảm bảo định dạng mã nhất quán.

### 🚫 **Quy tắc comment & Clean Code:**

- ✅ **Comment rõ ràng:** Giải thích lý do hơn cách làm.
- ✅ **TODO & FIXME:** Sử dụng chuẩn để đánh dấu công việc.
- ✅ **Hàm nhỏ gọn, rõ ràng:** Một hàm chỉ làm một việc.
- ✅ **Tên biến, hàm có ý nghĩa:** Tránh tên chung chung.
- ✅ **Tránh magic numbers:** Sử dụng hằng số thay vì số trực tiếp.

    ***

## 🌿 **Quy tắc Git (Tách nhánh & Commit)**

### 🌿 **Tách nhánh (Branching):**

- **main/master:** Phiên bản sản xuất (production-ready).
- **develop:** Phiên bản phát triển (tích hợp các nhánh feature).
- **feature/**: Tính năng mới (ví dụ: `feature/login-page`).
- **bugfix/**: Sửa lỗi (ví dụ: `bugfix/fix-header-bug`).
- **hotfix/**: Sửa lỗi gấp trên production (ví dụ: `hotfix/fix-payment-crash`).
- **release/**: Chuẩn bị phát hành (ví dụ: `release/v1.0.0`).

### 📝 **Quy tắc commit:**

#### 📜 **Cấu trúc commit:**

```
type(scope): subject
```

- **type:** feat, fix, chore, refactor, docs, test, style.
- **scope:** Thành phần bị ảnh hưởng (component, page, api).
- **subject:** Mô tả ngắn gọn.

#### 💡 **Ví dụ:**

```bash
feat(api): thêm chức năng đăng nhập
fix(component): sửa lỗi giao diện nút đăng ký
refactor(hooks): tối ưu useAuth hook
style(layout): điều chỉnh CSS cho header
```

#### 🎯 **Best Practices khi commit:**

- ✅ Commit ngắn gọn, rõ ràng.
- ✅ Tránh commit các file không cần thiết (node_modules, build).
- ✅ Sử dụng dấu gạch ngang để phân tách từ trong scope.
- ✅ Tránh commit code chưa hoàn thiện (sử dụng `WIP` nếu cần thiết).
