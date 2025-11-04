import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="text-2xl lg:text-3xl font-bold text-red-500 mb-4">
              Chiaki.vn
            </div>
            <p className="text-gray-300 mb-4 max-w-md text-sm">
              Chuyên cung cấp các sản phẩm chất lượng cao với giá cả hợp lý. 
              Cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
            </p>
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 text-sm">Kết nối với chúng tôi</h4>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Đăng ký nhận thông tin</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
                <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors font-medium text-sm">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm lg:text-base">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/return" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Về Chiaki */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm lg:text-base">Về Chiaki</h3>
            <ul className="space-y-2">
              {/* Giới thiệu removed */}
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Đối tác
                </Link>
              </li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm lg:text-base">Thông tin liên hệ</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-lg">📞</span>
                <div>
                  <p className="font-medium">Hotline:</p>
                  <p className="text-red-400 font-semibold">1900 1234</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-lg">📧</span>
                <div>
                  <p className="font-medium">Email:</p>
                  <p>info@chiaki.vn</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-lg">📍</span>
                <div>
                  <p className="font-medium">Địa chỉ:</p>
                  <p>123 Đường ABC, Quận 1, TP.HCM</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-lg">🕐</span>
                <div>
                  <p className="font-medium">Giờ làm việc:</p>
                  <p>8:00 - 22:00 (Tất cả các ngày)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Phương thức thanh toán</h4>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white rounded px-3 py-2 text-xs font-medium text-gray-800">VISA</div>
                <div className="bg-white rounded px-3 py-2 text-xs font-medium text-gray-800">MASTERCARD</div>
                <div className="bg-white rounded px-3 py-2 text-xs font-medium text-gray-800">JCB</div>
                <div className="bg-white rounded px-3 py-2 text-xs font-medium text-gray-800">MOMO</div>
                <div className="bg-white rounded px-3 py-2 text-xs font-medium text-gray-800">ZALOPAY</div>
                <div className="bg-white rounded px-3 py-2 text-xs font-medium text-gray-800">COD</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Chứng nhận</h4>
              <div className="flex gap-3">
                <div className="bg-white rounded px-4 py-2 text-xs font-medium text-gray-800">ĐKKD: 0123456789</div>
                <div className="bg-white rounded px-4 py-2 text-xs font-medium text-gray-800">SSL Secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2024 Chiaki.vn. Tất cả quyền được bảo lưu.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
              <span>|</span>
              <Link href="/terms" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
              <span>|</span>
              <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
