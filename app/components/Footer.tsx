import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#333333] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Về Chiaki</h3>
            <p className="text-gray-300 text-sm mb-4">
              Chiaki.vn là một trong những website mua sắm trực tuyến hàng đầu tại Việt Nam...
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="text-gray-300 hover:text-white">Câu hỏi thường gặp</Link></li>
              <li><Link href="/shipping" className="text-gray-300 hover:text-white">Gửi yêu cầu hỗ trợ</Link></li>
              <li><Link href="/return" className="text-gray-300 hover:text-white">Hướng dẫn đặt hàng</Link></li>
              <li><Link href="/warranty" className="text-gray-300 hover:text-white">Phương thức vận chuyển</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white">Chính sách đổi trả</Link></li>
            </ul>
          </div>

          {/* Thông tin và chính sách */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Thông tin và chính sách</h3>
            <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-300 hover:text-white">Giới thiệu Chiaki</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white">Điều khoản sử dụng</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white">Chính sách bảo mật</Link></li>
                <li><Link href="/affiliate" className="text-gray-300 hover:text-white">Chương trình tiếp thị liên kết</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Đăng ký nhận tin</h3>
            <p className="text-gray-300 text-sm mb-4">Đăng ký để nhận những ưu đãi mới nhất!</p>
            <div className="flex border border-gray-300 rounded-md bg-white">
              <input type="email" placeholder="Nhập email của bạn" className="w-full px-3 py-2 text-gray-800 rounded-l-md focus:outline-none"/>
              <button className="bg-[#E02020] text-white px-4 py-2 rounded-r-md hover:bg-red-700">Đăng ký</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#222222] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Chiaki.vn. All rights reserved.</p>
          <p className="mt-2">Công ty Cổ phần Thương mại Chiaki</p>
          <p>Địa chỉ: Tầng 1, Tòa nhà 24T3 Thanh Xuân Complex, Số 6 Lê Văn Thiêm, Phường Thanh Xuân Trung, Quận Thanh Xuân, Thành phố Hà Nội</p>
        </div>
      </div>
    </footer>
  );
}
