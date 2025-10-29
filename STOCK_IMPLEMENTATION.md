# Triển khai tính năng quản lý Stock

## Tổng quan
Đã thêm tính năng quản lý stock (tồn kho) vào ứng dụng e-commerce để chỉ cho phép mua sản phẩm khi còn hàng.

## Các thay đổi đã thực hiện

### 1. Cập nhật Interface Product
- **File**: `app/types/product.ts`
- **Thay đổi**: Thêm trường `stock: number` vào interface Product

### 2. Cập nhật ProductCard Component
- **File**: `app/components/ProductCard.tsx`
- **Thay đổi**:
  - Hiển thị trạng thái stock với màu sắc khác nhau:
    - Xanh lá: Còn hàng (>10 sản phẩm)
    - Vàng: Sắp hết hàng (1-10 sản phẩm)
    - Đỏ: Hết hàng (0 sản phẩm)
  - Disable nút "Thêm vào giỏ" khi hết hàng
  - Kiểm tra stock trước khi thêm vào giỏ

### 3. Cập nhật CartContext
- **File**: `app/contexts/CartContext.tsx`
- **Thay đổi**:
  - Thêm kiểm tra stock trong hàm `addToCart()`
  - Thêm kiểm tra stock trong hàm `updateQuantity()`
  - Hiển thị thông báo khi vượt quá số lượng có sẵn

### 4. Cập nhật CartItem Component
- **File**: `app/components/CartItem.tsx`
- **Thay đổi**:
  - Hiển thị thông tin stock cho từng sản phẩm
  - Disable nút tăng số lượng khi đã đạt giới hạn stock
  - Màu sắc thay đổi theo trạng thái stock

### 5. Cập nhật trang chi tiết sản phẩm
- **File**: `app/products/[id]/page.tsx`
- **Thay đổi**:
  - Hiển thị trạng thái stock
  - Disable nút tăng số lượng khi đạt giới hạn stock
  - Kiểm tra stock trước khi thêm vào giỏ
  - Disable nút "Mua ngay" khi hết hàng

### 6. Cập nhật trang Checkout
- **File**: `app/checkout/page.tsx`
- **Thay đổi**:
  - Kiểm tra stock trước khi thanh toán
  - Hiển thị thông báo nếu có sản phẩm hết hàng

### 7. Cập nhật OrderSummary Component
- **File**: `app/components/OrderSummary.tsx`
- **Thay đổi**:
  - Hiển thị thông tin stock cho từng sản phẩm
  - Thêm cảnh báo nếu có sản phẩm sắp hết hàng

## Cách hoạt động

### Kiểm tra Stock
1. **Khi thêm vào giỏ**: Kiểm tra stock > 0 và số lượng không vượt quá stock
2. **Khi cập nhật số lượng**: Kiểm tra tổng số lượng không vượt quá stock
3. **Khi thanh toán**: Kiểm tra lại stock của tất cả sản phẩm trong giỏ

### Hiển thị trạng thái
- **Còn hàng** (xanh lá): Stock > 10
- **Sắp hết hàng** (vàng): 1 ≤ Stock ≤ 10
- **Hết hàng** (đỏ): Stock = 0

### Thông báo lỗi
- "Sản phẩm đã hết hàng!" - khi stock = 0
- "Chỉ còn X sản phẩm trong kho!" - khi vượt quá stock
- "Một số sản phẩm đã hết hàng..." - khi thanh toán

## Lưu ý
- Cần đảm bảo API Strapi trả về trường `stock` trong response
- Trường `stock` đã được thêm vào schema của Strapi
- Tất cả các component đã được cập nhật để xử lý trường `stock`
