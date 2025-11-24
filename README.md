TechPhone – AI Powered Smartphone E-Commerce Platform

TechPhone là nền tảng thương mại điện tử chuyên bán điện thoại, tích hợp AI Chatbot hỗ trợ tư vấn khách hàng và Recommendation System gợi ý sản phẩm thông minh dựa trên hành vi mua sắm.
Hệ thống gồm:

Frontend: React + Vite + TailwindCSS

Backend: Laravel REST API

Database: PHPMySQL

AI Chatbot: GEMINI API / LLM service

Recommendation Engine: Collaborative Filtering + Best-Seller Suggestion

  🚀 Tính năng nổi bật
  🛒 Chức năng mua sắm

Xem danh sách điện thoại theo hãng / mức giá

  Lọc, tìm kiếm theo nhiều tiêu chí
  
  Giỏ hàng theo user + LocalStorage
  
  Thanh toán (Payment Gateway như MoMo/VNPay nếu tích hợp)
  
  Quản lý đơn hàng đầy đủ (CRUD)

🤖 AI Chatbot (React + Laravel)

  Tư vấn thông minh về điện thoại
  
  Gợi ý theo nhu cầu (chơi game, camera đẹp, pin trâu…)
  
  Hỗ trợ theo dõi đơn hàng
  
  Lưu lịch sử hội thoại theo sessionId

🎯 Recommendation System

  Gợi ý dựa trên:
  
  Sản phẩm mua nhiều nhất
  
  Sản phẩm cùng danh mục
  
  Lịch sử mua của user (nếu có)
  
  Hỗ trợ cache để tăng tốc

🛠 Quản trị (Admin Panel)

  Quản lý sản phẩm, tồn kho
  
  Quản lý đơn hàng
  
  Quản lý khuyến mãi / mã giảm giá
  
  Dashboard thống kê doanh thu
  
  Kiến trúc hệ thống
┌──────────────┐     API JSON     ┌─────────────────┐
│   React UI   │  <────────────►  │     Laravel     │
│ (Vite + TW)  │  ◄────────────>  │    REST API     │
└──────────────┘                  └─────────────────┘
        │                                   │
        ▼                                   ▼
┌─────────────────┐              ┌────────────────────┐
│  AI Chat Widget │              │ Recommendation Core │
└─────────────────┘              └────────────────────┘
        │                                   │
        ▼                                   ▼
                   ┌────────────────────┐
                   │     MySQL DB       │
                   └────────────────────┘
