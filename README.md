# Chiaki E-commerce Frontend

Frontend cho ứng dụng e-commerce được xây dựng với Next.js 16, TypeScript và Tailwind CSS, tích hợp với backend Strapi.

## Tính năng

- 🏠 **Trang chủ**: Hiển thị sản phẩm nổi bật và thông tin công ty
- 🛍️ **Danh sách sản phẩm**: Xem tất cả sản phẩm với tìm kiếm và lọc
- 📱 **Chi tiết sản phẩm**: Xem thông tin chi tiết, hình ảnh và mô tả
- 🔍 **Tìm kiếm**: Tìm kiếm sản phẩm theo tên và mô tả
- 📱 **Responsive**: Giao diện tối ưu cho mọi thiết bị
- 🎨 **UI/UX**: Thiết kế hiện đại, thân thiện với người dùng

## Công nghệ sử dụng

- **Next.js 16**: React framework với App Router
- **TypeScript**: Type safety và developer experience tốt hơn
- **Tailwind CSS**: Utility-first CSS framework
- **Strapi**: Headless CMS cho backend

## Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js 18+ 
- npm hoặc yarn
- Backend Strapi đang chạy trên port 1337

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd my-app
```

### Bước 2: Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### Bước 3: Cấu hình environment

Tạo file `.env.local` trong thư mục `my-app`:

```env
NEXT_PUBLIC_API_URL=http://localhost:1337
```

### Bước 4: Chạy backend Strapi

Trong thư mục `my-strapi-project`:

```bash
npm run develop
```

Backend sẽ chạy trên `http://localhost:1337`

### Bước 5: Chạy frontend

Trong thư mục `my-app`:

```bash
npm run dev
# hoặc
yarn dev
```

Frontend sẽ chạy trên `http://localhost:3000`

## Cấu trúc dự án

```
my-app/
├── app/
│   ├── components/          # React components
│   │   ├── Header.tsx      # Header với navigation
│   │   ├── Footer.tsx      # Footer với thông tin liên hệ
│   │   └── ProductCard.tsx # Card hiển thị sản phẩm
│   ├── lib/                # Utility functions
│   │   ├── api.ts          # API client
│   │   └── products.ts     # Product service
│   ├── types/              # TypeScript types
│   │   └── product.ts      # Product interface
│   ├── products/           # Product pages
│   │   ├── page.tsx        # Danh sách sản phẩm
│   │   └── [id]/page.tsx   # Chi tiết sản phẩm
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Trang chủ
├── public/                 # Static assets
└── package.json
```

## API Endpoints

Dự án sử dụng các API endpoints từ Strapi:

- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

## Tính năng chính

### Trang chủ
- Hero section với call-to-action
- Hiển thị sản phẩm nổi bật
- Các tính năng nổi bật của công ty

### Danh sách sản phẩm
- Grid layout responsive
- Tìm kiếm sản phẩm
- Pagination (có thể mở rộng)
- Loading states

### Chi tiết sản phẩm
- Gallery hình ảnh
- Thông tin sản phẩm chi tiết
- Chọn số lượng
- Nút thêm vào giỏ hàng
- Breadcrumb navigation

## Styling

Dự án sử dụng Tailwind CSS với:
- Color scheme: Đỏ (#DC2626) làm màu chủ đạo
- Responsive breakpoints
- Custom utilities cho line-clamp
- Smooth scrolling
- Custom scrollbar

## Phát triển thêm

### Thêm tính năng mới
1. Tạo component mới trong `app/components/`
2. Thêm types nếu cần trong `app/types/`
3. Cập nhật API service trong `app/lib/`
4. Tạo page mới trong `app/`

### Customization
- Thay đổi màu sắc trong `tailwind.config.js`
- Cập nhật metadata trong `app/layout.tsx`
- Thêm fonts mới trong `app/layout.tsx`

## Troubleshooting

### Lỗi kết nối API
- Kiểm tra backend Strapi đang chạy
- Xác nhận URL trong `.env.local`
- Kiểm tra CORS settings trong Strapi

### Lỗi build
- Xóa `.next` folder và chạy lại `npm run build`
- Kiểm tra TypeScript errors
- Cập nhật dependencies nếu cần

## License

MIT License