# Hướng dẫn sử dụng Giỏ hàng và Thanh toán

## Tổng quan
Đã thêm thành công chức năng giỏ hàng và thanh toán vào ứng dụng Next.js. Các tính năng bao gồm:

### 🛒 Chức năng Giỏ hàng
- Thêm sản phẩm vào giỏ hàng
- Xem danh sách sản phẩm trong giỏ hàng
- Cập nhật số lượng sản phẩm
- Xóa sản phẩm khỏi giỏ hàng
- Xóa tất cả sản phẩm
- Lưu trữ giỏ hàng trong localStorage
- Hiển thị số lượng sản phẩm trên header

### 💳 Chức năng Thanh toán
- Form thông tin khách hàng đầy đủ
- Form địa chỉ giao hàng
- Chọn phương thức thanh toán (COD, Chuyển khoản, MoMo, ZaloPay)
- Tóm tắt đơn hàng
- Xác thực form
- Trang thành công đặt hàng

## Cấu trúc Files

### Contexts
- `app/contexts/CartContext.tsx` - Quản lý state giỏ hàng

### Components
- `app/components/CartItem.tsx` - Component hiển thị item trong giỏ hàng
- `app/components/CartSummary.tsx` - Component tóm tắt giỏ hàng
- `app/components/CheckoutForm.tsx` - Form thanh toán
- `app/components/OrderSummary.tsx` - Tóm tắt đơn hàng

### Pages
- `app/cart/page.tsx` - Trang giỏ hàng
- `app/checkout/page.tsx` - Trang thanh toán
- `app/order-success/page.tsx` - Trang thành công đặt hàng

### Cập nhật
- `app/components/ProductCard.tsx` - Thêm nút "Thêm vào giỏ"
- `app/components/Header.tsx` - Thêm icon giỏ hàng với số lượng
- `app/layout.tsx` - Thêm CartProvider

## Cách sử dụng

### 1. Thêm sản phẩm vào giỏ hàng
- Trên trang sản phẩm, click nút "Thêm vào giỏ"
- Sản phẩm sẽ được thêm vào giỏ hàng và lưu trong localStorage
- Nút sẽ chuyển thành "Đã có trong giỏ" nếu sản phẩm đã có

### 2. Xem giỏ hàng
- Click vào icon giỏ hàng trên header
- Hoặc truy cập `/cart`
- Có thể cập nhật số lượng, xóa sản phẩm

### 3. Thanh toán
- Từ trang giỏ hàng, click "Tiến hành thanh toán"
- Hoặc truy cập `/checkout`
- Điền đầy đủ thông tin và chọn phương thức thanh toán
- Click "Đặt hàng" để hoàn tất

### 4. Xác nhận đơn hàng
- Sau khi đặt hàng thành công, sẽ chuyển đến trang xác nhận
- Hiển thị mã đơn hàng và thông tin giao hàng

## Tính năng nổi bật

### 🎯 UX/UI
- Responsive design cho mobile và desktop
- Loading states và feedback cho người dùng
- Form validation với thông báo lỗi rõ ràng
- Animation và transition mượt mà

### 🔒 Bảo mật
- Xác thực người dùng trước khi thanh toán
- Validation form phía client
- Lưu trữ an toàn trong localStorage

### 📱 Responsive
- Tối ưu cho mobile
- Grid layout linh hoạt
- Touch-friendly buttons

### 🚀 Performance
- Context API để quản lý state hiệu quả
- Lazy loading và code splitting
- Optimized images với Next.js Image

## Cấu hình

### Environment Variables
Đảm bảo có các biến môi trường:
```env
NEXT_PUBLIC_API_URL=http://localhost:1337
```

### Dependencies
Các dependencies cần thiết đã có sẵn:
- Next.js
- React
- TypeScript
- Tailwind CSS

## Testing

### Test Cases
1. ✅ Thêm sản phẩm vào giỏ hàng
2. ✅ Cập nhật số lượng sản phẩm
3. ✅ Xóa sản phẩm khỏi giỏ hàng
4. ✅ Xóa tất cả sản phẩm
5. ✅ Lưu trữ giỏ hàng trong localStorage
6. ✅ Form validation thanh toán
7. ✅ Chuyển hướng sau khi đặt hàng
8. ✅ Responsive design

## Troubleshooting

### Lỗi thường gặp
1. **Giỏ hàng không lưu**: Kiểm tra localStorage có được enable
2. **Form validation không hoạt động**: Kiểm tra các field required
3. **Redirect không hoạt động**: Kiểm tra authentication state

### Debug
- Mở Developer Tools để xem console logs
- Kiểm tra localStorage trong Application tab
- Verify network requests trong Network tab

## Tương lai

### Tính năng có thể thêm
- [ ] Wishlist (Danh sách yêu thích)
- [ ] Coupon/Discount codes
- [ ] Multiple shipping addresses
- [ ] Order history
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Inventory management
- [ ] Order tracking

## Kết luận

Hệ thống giỏ hàng và thanh toán đã được implement hoàn chỉnh với:
- ✅ UI/UX hiện đại và responsive
- ✅ State management hiệu quả
- ✅ Form validation đầy đủ
- ✅ Error handling tốt
- ✅ Code structure rõ ràng và maintainable

Ứng dụng sẵn sàng để sử dụng và có thể mở rộng thêm nhiều tính năng khác.
