'use client';

import { useEffect, useState } from 'react';
import ProductCard from './components/ProductCard';
import { Product } from './types/product';
import { productService } from './lib/products';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { name: 'Thực phẩm chức năng', icon: '🌿' },
    { name: 'Collagen', icon: '💊' },
    { name: 'Mỹ phẩm', icon: '💄' },
    { name: 'Mẹ và Bé', icon: '👶' },
    { name: 'Thời trang', icon: '👗' },
    { name: 'Đồ gia dụng', icon: '🏠' },
    { name: 'Nhà Cửa & Đời Sống', icon: '🏡' },
    { name: 'Thực phẩm - Hàng tiêu dùng', icon: '🛒' },
    { name: 'Thiết bị chăm sóc sức khỏe', icon: '🏥' },
    { name: 'Đồ thể thao - Du lịch', icon: '⚽' },
    { name: 'Sách truyện', icon: '📚' },
    { name: 'Văn phòng phẩm', icon: '📝' },
    { name: 'Thiết bị - Phụ kiện số', icon: '📱' },
    { name: 'Đồng hồ', icon: '⌚' },
    { name: 'Chăm sóc thú cưng', icon: '🐕' },
    { name: 'Điện máy - Điện lạnh', icon: '❄️' },
    { name: 'Điện thoại - Máy tính bảng', icon: '📱' },
    { name: 'Thương hiệu nổi bật', icon: '⭐' }
  ];

  const categoryGrid = [
    { name: 'Thực phẩm chức năng', icon: '🌿' },
    { name: 'Mẹ và Bé', icon: '👶' },
    { name: 'Mỹ phẩm', icon: '💄' },
    { name: 'Thời trang', icon: '👗' },
    { name: 'Đồ gia dụng nhà bếp', icon: '🍳' },
    { name: 'Thiết bị chăm sóc sức khỏe', icon: '🏥' },
    { name: 'Đồ thể thao - Du lịch', icon: '⚽' },
    { name: 'Thực phẩm - Hàng tiêu dùng', icon: '🛒' },
    { name: 'Voucher khuyến mại', icon: '🎫' },
    { name: 'Nhà Cửa & Đời Sống', icon: '🏡' },
    { name: 'Chăm sóc thú cưng', icon: '🐕' },
    { name: 'Thiết bị - Phụ kiện số', icon: '📱' },
    { name: 'Điện máy - Điện lạnh', icon: '❄️' },
    { name: 'Văn phòng phẩm', icon: '📝' },
    { name: 'Ô tô, xe máy, xe đạp', icon: '🚗' },
    { name: 'Dụng cụ và thiết bị tiện ích', icon: '🔧' },
    { name: 'Ngành hàng khác', icon: '📦' },
    { name: 'Chăm sóc cá nhân', icon: '🧴' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Danh mục sản phẩm</h2>
            <nav className="space-y-2">
              {categories.map((category, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center justify-between p-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main>
            {/* Main Banner Section */}
            <section className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex gap-6">
                  {/* Main Banner */}
                  <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-8 relative overflow-hidden">
                    <div className="relative z-10">
                      <h1 className="text-3xl font-bold mb-4">GIỚI THIỆU NHÀ BÁN HÀNG MỚI</h1>
                      <p className="text-xl mb-2">Nhận Quà Ngay Từ Chiaki!</p>
                      <p className="text-sm mb-6">Khuyến mãi đặc biệt cho nhà bán hàng mới</p>
                      <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center">
                        <span className="mr-2">▶</span>
                        GIỚI THIỆU NGAY
                      </button>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded text-sm font-bold">
                      TẶNG 1 TRIỆU
                    </div>
                    <div className="absolute bottom-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded text-sm font-bold">
                      TẶNG 50K
                    </div>
                  </div>

                  {/* Right Side Banners */}
                  <div className="w-80 space-y-4">
                    <div className="bg-blue-500 rounded-lg p-4 text-center">
                      <h3 className="font-bold text-lg mb-2">OBAGI SALE UPTO 30%</h3>
                      <p className="text-sm">Mỹ phẩm cao cấp</p>
                    </div>
                    <div className="bg-green-500 rounded-lg p-4 text-center">
                      <h3 className="font-bold text-lg mb-2">BLACKMORES</h3>
                      <p className="text-sm">Chăm sóc sức khỏe toàn diện</p>
                      <p className="text-yellow-300 font-bold">GIẢM TỚI 30%</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Vitamin Banner */}
            <section className="bg-white p-6 border-b">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-blue-600">Chiaki.vn</div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">BỔ SUNG VITAMIN VÀ KHOÁNG CHẤT</h2>
                      <p className="text-sm text-gray-600">MẸ BẦU KHỎE MẠNH, BÉ YÊU PHÁT TRIỂN</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-red-600 font-bold text-lg">GIẢM TỚI 30%</p>
                      <div className="flex space-x-2 mt-2">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">VITAMIN BẦU</button>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">VITAMIN SAU SINH</button>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">LỢI SỮA</button>
                      </div>
                    </div>
                    <button className="bg-red-600 text-white px-6 py-2 rounded font-bold">MUA NGAY</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Categories Section */}
            <section className="bg-white py-8">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">DANH MỤC</h2>
                <div className="grid grid-cols-6 gap-4">
                  {categoryGrid.map((category, index) => (
                    <div key={index} className="text-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
                        {category.icon}
                      </div>
                      <p className="text-sm text-gray-700">{category.name}</p>
                    </div>
                  ))}
                </div>
                <div className="text-right mt-4">
                  <span className="text-gray-400">›</span>
                </div>
              </div>
            </section>

            {/* Flash Sale Section */}
            <section className="bg-white py-8">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <span className="text-red-500 mr-2">⚡</span>
                      FLASH SALE
                    </h2>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold">
                      ONLY THIS WEEKEND FLASH SALE
                    </div>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded font-bold">
                    Xem thêm
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full max-w-7xl mx-auto">
                    {products.slice(0, 6).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
