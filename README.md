#  TechPhone - Website Thương Mại Điện Tử Điện Thoại Tích Hợp AI

[![Laravel](https://img.shields.io/badge/Laravel-^12.0-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-^19.1.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-^4.1.14-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-^7.1.7-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Yarn](https://img.shields.io/badge/Yarn-^1.22-2C8EBB?style=for-the-badge&logo=yarn)](https://yarnpkg.com/)
[![AI Powered](https://img.shields.io/badge/AI_Powered-Gemini-FF6B00?style=for-the-badge&logo=google)](https://ai.google/technologies/gemini)

## Giới Thiệu

**TechPhone** là một nền tảng thương mại điện tử chuyên bán điện thoại di động, được xây dựng trên bộ công nghệ hiện đại: **Laravel (Backend API) Phiên bản ^12.0** kết hợp với **React/Vite/Tailwind CSS (Frontend)**.

Điểm nổi bật của dự án là việc tích hợp **Trợ lý AI Chatbot** sử dụng **API Gemini** của Google và một **Hệ thống Gợi ý Sản phẩm (Recommendation System)** thông minh, nhằm cá nhân hóa và tối ưu hóa trải nghiệm mua sắm của khách hàng.

---

##  Tính Năng Nổi Bật

* **Giao Diện Mua Sắm Hiện Đại:** Sử dụng React/Vite cho giao diện người dùng nhanh chóng, mượt mà (Single Page Application - SPA experience).
* **Tích Hợp Thanh Toán Momo:** Hỗ trợ thanh toán nhanh chóng và an toàn qua cổng **Momo Payment Gateway** trực tiếp trên website.
* **Trợ Lý AI Chatbot:** Tích hợp **API Gemini** giúp người dùng tra cứu thông tin sản phẩm, so sánh cấu hình, và nhận gợi ý mua hàng chuyên sâu.
* **Hệ Thống Gợi Ý Thông Minh:** Đề xuất sản phẩm dựa trên hành vi người dùng, lịch sử xem, và các thuật toán liên quan để tăng tỷ lệ chuyển đổi.
* **Backend Mạnh Mẽ:** **Laravel 12+** đóng vai trò là API Backend bảo mật, có cấu trúc rõ ràng và dễ dàng mở rộng.
* **Thiết Kế Responsive:** Giao diện được xây dựng hoàn toàn bằng **Tailwind CSS**, đảm bảo hiển thị đẹp mắt trên mọi kích thước màn hình.

---

## Công Nghệ Sử Dụng

| Lĩnh vực | Công nghệ | Phiên bản | Mô tả |
| :--- | :--- | :--- | :--- |
| **Backend** | **Laravel** | **^12.x** | Khung PHP mạnh mẽ và bảo mật. |
| **Frontend** | **React** | ^19.x | Thư viện JavaScript hàng đầu để xây dựng UI. |
| **Build Tool** | **Vite** | ^7.x | Công cụ build/dev server siêu nhanh. |
| **Styling** | **Tailwind CSS** | ^3.x | Khung CSS utility-first linh hoạt. |
| **AI Integration**| **Gemini API**| Mới nhất| Cung cấp khả năng Chatbot đàm thoại thông minh. |
| **Quản lý gói** | **Yarn** | ^1.22/2.x| Công cụ quản lý dependency nhanh và đáng tin cậy. |
| **Cơ sở dữ liệu**| **MySQL/PostgreSQL**| Tùy chọn | Cơ sở dữ liệu quan hệ mạnh mẽ. |

---

## Cài Đặt và Khởi Động Dự Án

### Yêu cầu Tiên quyết

* **PHP** (>= 8.1) **(Khuyến nghị >= 8.2 cho Laravel 12)**
* **Composer**
* **Node.js** (>= 22.x)
* **Yarn**
* **Cơ sở dữ liệu** (MySQL)

## 1. Backend (Laravel)

```bash
# 1. Clone repository
git clone [https://github.com/hoangnam13102000/TrungNamShop.git](https://github.com/hoangnam13102000/TrungNamShop.git)
cd TechPhone

# 2. Cài đặt các thư viện PHP
composer install

# 3. Sao chép và cấu hình biến môi trường
cp .env.example .env

# 4. Tạo App Key
php artisan key:generate

# 5. Cấu hình Database và các biến khác trong tệp .env

# 6. Chạy Migration và Seeder 
php artisan migrate --seed

# 7. Khởi động Laravel Server (Mở Terminal 1)
php artisan serve
# Server sẽ chạy tại [http://127.0.0.1:8000](http://127.0.0.1:8000)

```

## 2. **Frontend (React/Vite)**

```bash
# 1. Di chuyển vào thư mục gốc của dự án nếu chưa ở đó
cd TechPhone 

# 2. Cài đặt các dependency bằng Yarn
yarn install

# 3. Chạy Vite Development Server
yarn dev
# Vite sẽ chạy và tự động reload, thường tại http://localhost:5173

```

## 3.Cấu Hình API Key (Gemini)

### Để kích hoạt tính năng Chatbot AI, bạn cần thiết lập khóa Gemini API Key.

  1. Đăng ký hoặc truy cập Google AI Studio để tạo khóa.

  2. Thêm khóa vào tệp .env ở thư mục gốc của dự án theo cú pháp:

```bash
  GEMINI_API_KEY="YOUR_API_KEY_HERE"
  GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
  GEMINI_MODEL=gemini-2.5-flash

```
## 4.Cấu Hình Thanh Toán Momo

### Để kích hoạt chức năng thanh toán trực tuyến qua Momo, bạn cần cấu hình các biến môi trường sau trong tệp .env ở Backend:

  1. Đăng ký tài khoản Đối tác Momo: Lấy các thông tin cấu hình từ cổng quản lý của Momo.

  2. Thêm các biến sau vào .env:
     
```bash

# Cổng thanh toán Momo
MOMO_PARTNER_CODE="YOUR_PARTNER_CODE"
MOMO_ACCESS_KEY="YOUR_ACCESS_KEY"
MOMO_SECRET_KEY="YOUR_SECRET_KEY"
MOMO_ENDPOINT="[https://test-payment.momo.vn/v2/gateway/api/create](https://test-payment.momo.vn/v2/gateway/api/create)" 
MOMO_RETURN_URL="[http://127.0.0.1:8000/api/momo/return](http://127.0.0.1:8000/api/momo/return)"
MOMO_NOTIFY_URL="[http://127.0.0.1:8000/api/momo/ipn](http://127.0.0.1:8000/api/momo/ipn)"

```
