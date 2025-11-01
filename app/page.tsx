'use client';

import { useEffect, useState } from 'react';
import ProductCard from './components/ProductCard';
import { Product } from './types/product';
import { productService } from './lib/products';
import Link from 'next/link';

interface CategorySubItem {
  name: string;
  href?: string;
}

interface CategoryColumn {
  title: string;
  items: CategorySubItem[];
}

interface Category {
  name: string;
  icon: string;
  columns: CategoryColumn[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Cấu trúc dữ liệu danh mục với các danh mục con
  const categoriesWithSub: Category[] = [
    {
      name: 'Thực phẩm chức năng',
      icon: '🌿',
      columns: [
        {
          title: 'Hỗ Trợ Sức Khỏe',
          items: [
            { name: 'Vitamin Và Khoáng Chất' },
            { name: 'Sữa dinh dưỡng' },
            { name: 'Bổ mắt' },
            { name: 'Bổ gan' },
            { name: 'Bổ não, tăng cường trí nhớ' },
            { name: 'Bổ trợ xương khớp' },
            { name: 'Hỗ trợ tiêu hóa' },
            { name: 'Hỗ trợ tim mạch' },
            { name: 'Hỗ trợ Tiểu đường' },
            { name: 'Hỗ trợ điều trị bệnh gout' },
            { name: 'Yến sào' },
            { name: 'Nấm linh chi' },
            { name: 'Cao Hồng Sâm' },
            { name: 'Nước Hồng Sâm' },
            { name: 'Tinh dầu thông đỏ' },
            { name: 'Đông trùng hạ thảo' }
          ]
        },
        {
          title: 'Sinh Lý - Nội Tiết Tố',
          items: [
            { name: 'Tinh chất hàu' },
            { name: 'Mầm đậu nành' },
            { name: 'Cân bằng nội tiết tố' },
            { name: 'Viên uống tăng khả năng thụ thai' }
          ]
        },
        {
          title: 'Hỗ trợ làm đẹp',
          items: [
            { name: 'Tảo biển' },
            { name: 'Tăng cân' },
            { name: 'Giảm cân' },
            { name: 'Mọc tóc, trị hói' },
            { name: 'Tăng chiều cao' },
            { name: 'Nhau Thai Cừu' },
            { name: 'Sữa Ong Chúa' },
            { name: 'Viên uống trị mụn' },
            { name: 'Viên uống nở ngực' },
            { name: 'Viên uống trắng da' },
            { name: 'Tinh dầu hoa anh thảo' },
            { name: 'Viên uống chống nắng' },
            { name: 'Viên uống thơm cơ thể' },
            { name: 'Dinh dưỡng thể hình' }
          ]
        },
        {
          title: 'Thương hiệu',
          items: [
            { name: 'Blackmores' },
            { name: 'Kirkland' },
            { name: 'Healthy Care' },
            { name: 'Orihiro' },
            { name: 'Nature Made' },
            { name: 'DHC' },
            { name: 'Swisse' },
            { name: 'Natrol' },
            { name: 'Bio Island' },
            { name: 'Puritan\'s Pride' },
            { name: 'Schiff' },
            { name: 'Glucosamine' },
            { name: 'Tất cả (A-Z)', href: '/products?brands=all' }
          ]
        }
      ]
    },
    {
      name: 'Collagen',
      icon: '💊',
      columns: [
        {
          title: 'Collagen Dạng Nước',
          items: [
            { name: 'Collagen Nước' },
            { name: 'Collagen Viên' },
            { name: 'Collagen Bột' },
            { name: 'Collagen Chống Nắng' }
          ]
        },
        {
          title: 'Collagen Theo Độ Tuổi',
          items: [
            { name: 'Collagen 20+' },
            { name: 'Collagen 30+' },
            { name: 'Collagen 40+' },
            { name: 'Collagen 50+' }
          ]
        },
        {
          title: 'Thương hiệu',
          items: [
            { name: 'Meiji' },
            { name: 'Neocell' },
            { name: 'Shiseido' },
            { name: 'Swisse' }
          ]
        }
      ]
    },
    {
      name: 'Mỹ phẩm',
      icon: '💄',
      columns: [
        {
          title: 'Chăm Sóc Da Mặt',
          items: [
            { name: 'Serum' },
            { name: 'Kem dưỡng ẩm' },
            { name: 'Toner' },
            { name: 'Sữa rửa mặt' },
            { name: 'Kem chống nắng' }
          ]
        },
        {
          title: 'Trang Điểm',
          items: [
            { name: 'Kem nền' },
            { name: 'Phấn phủ' },
            { name: 'Son môi' },
            { name: 'Phấn mắt' }
          ]
        },
        {
          title: 'Chăm Sóc Tóc',
          items: [
            { name: 'Dầu gội' },
            { name: 'Dầu xả' },
            { name: 'Mặt nạ tóc' }
          ]
        },
        {
          title: 'Thương hiệu',
          items: [
            { name: 'Obagi' },
            { name: 'Shiseido' },
            { name: 'Laneige' },
            { name: 'Innisfree' }
          ]
        }
      ]
    },
    {
      name: 'Mẹ và Bé',
      icon: '👶',
      columns: [
        {
          title: 'Dinh Dưỡng Mẹ Bầu',
          items: [
            { name: 'Vitamin Bầu' },
            { name: 'Vitamin Sau Sinh' },
            { name: 'Sữa Bầu' },
            { name: 'Lợi Sữa' }
          ]
        },
        {
          title: 'Đồ Dùng Cho Bé',
          items: [
            { name: 'Sữa công thức' },
            { name: 'Bình sữa' },
            { name: 'Tã bỉm' },
            { name: 'Đồ chơi' }
          ]
        },
        {
          title: 'Thương hiệu',
          items: [
            { name: 'Aptamil' },
            { name: 'Similac' },
            { name: 'Enfamil' }
          ]
        }
      ]
    },
    {
      name: 'Thời trang',
      icon: '👗',
      columns: [
        {
          title: 'Thời Trang Nam',
          items: [
            { name: 'Áo sơ mi' },
            { name: 'Quần âu' },
            { name: 'Giày dép' }
          ]
        },
        {
          title: 'Thời Trang Nữ',
          items: [
            { name: 'Váy' },
            { name: 'Áo' },
            { name: 'Giày' }
          ]
        }
      ]
    },
    {
      name: 'Đồ gia dụng',
      icon: '🏠',
      columns: [
        {
          title: 'Nhà Bếp',
          items: [
            { name: 'Nồi chảo' },
            { name: 'Dụng cụ nấu ăn' },
            { name: 'Đồ dùng nhà bếp' }
          ]
        },
        {
          title: 'Phòng Tắm',
          items: [
            { name: 'Khăn tắm' },
            { name: 'Bộ đồ vệ sinh' }
          ]
        }
      ]
    },
    {
      name: 'Nhà Cửa & Đời Sống',
      icon: '🏡',
      columns: [
        {
          title: 'Nội Thất',
          items: [
            { name: 'Bàn ghế' },
            { name: 'Tủ kệ' },
            { name: 'Đèn' }
          ]
        }
      ]
    },
    {
      name: 'Thực phẩm - Hàng tiêu dùng',
      icon: '🛒',
      columns: [
        {
          title: 'Thực Phẩm',
          items: [
            { name: 'Đồ khô' },
            { name: 'Đồ hộp' },
            { name: 'Gia vị' }
          ]
        }
      ]
    },
    {
      name: 'Thiết bị chăm sóc sức khỏe',
      icon: '🏥',
      columns: [
        {
          title: 'Thiết Bị Y Tế',
          items: [
            { name: 'Máy đo huyết áp' },
            { name: 'Nhiệt kế' },
            { name: 'Máy xông mũi' }
          ]
        }
      ]
    },
    {
      name: 'Đồ thể thao - Du lịch',
      icon: '⚽',
      columns: [
        {
          title: 'Thể Thao',
          items: [
            { name: 'Quần áo thể thao' },
            { name: 'Giày thể thao' },
            { name: 'Dụng cụ thể thao' }
          ]
        }
      ]
    },
    {
      name: 'Sách truyện',
      icon: '📚',
      columns: [
        {
          title: 'Sách',
          items: [
            { name: 'Sách văn học' },
            { name: 'Sách kỹ năng' },
            { name: 'Truyện tranh' }
          ]
        }
      ]
    },
    {
      name: 'Văn phòng phẩm',
      icon: '📝',
      columns: [
        {
          title: 'Đồ Dùng Văn Phòng',
          items: [
            { name: 'Bút' },
            { name: 'Vở' },
            { name: 'Bìa hồ sơ' }
          ]
        }
      ]
    },
    {
      name: 'Thiết bị - Phụ kiện số',
      icon: '📱',
      columns: [
        {
          title: 'Điện Thoại',
          items: [
            { name: 'iPhone' },
            { name: 'Samsung' },
            { name: 'Phụ kiện' }
          ]
        }
      ]
    },
    {
      name: 'Đồng hồ',
      icon: '⌚',
      columns: [
        {
          title: 'Đồng Hồ',
          items: [
            { name: 'Đồng hồ nam' },
            { name: 'Đồng hồ nữ' },
            { name: 'Smartwatch' }
          ]
        }
      ]
    },
    {
      name: 'Chăm sóc thú cưng',
      icon: '🐕',
      columns: [
        {
          title: 'Thú Cưng',
          items: [
            { name: 'Thức ăn' },
            { name: 'Đồ chơi' },
            { name: 'Phụ kiện' }
          ]
        }
      ]
    },
    {
      name: 'Điện máy - Điện lạnh',
      icon: '❄️',
      columns: [
        {
          title: 'Điện Lạnh',
          items: [
            { name: 'Tủ lạnh' },
            { name: 'Máy lạnh' },
            { name: 'Máy giặt' }
          ]
        }
      ]
    },
    {
      name: 'Điện thoại - Máy tính bảng',
      icon: '📱',
      columns: [
        {
          title: 'Thiết Bị',
          items: [
            { name: 'iPhone' },
            { name: 'Samsung' },
            { name: 'iPad' }
          ]
        }
      ]
    },
    {
      name: 'Thương hiệu nổi bật',
      icon: '⭐',
      columns: [
        {
          title: 'Thương Hiệu',
          items: [
            { name: 'Blackmores' },
            { name: 'Obagi' },
            { name: 'Meiji' },
            { name: 'Shiseido' }
          ]
        }
      ]
    }
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
        {/* Left Sidebar - Category List */}
        <div className="w-64 bg-white shadow-lg min-h-screen hidden lg:block relative z-40">
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Danh mục sản phẩm</h2>
            <nav className="space-y-1">
              {categoriesWithSub.map((category, index) => (
                <div
                  key={index}
                  className="relative group"
                  onMouseEnter={() => {
                    // Clear any existing timeout
                    if (hoverTimeout) {
                      clearTimeout(hoverTimeout);
                    }
                    setHoveredCategory(index);
                  }}
                  onMouseLeave={() => {
                    // Delay hiding to allow mouse to move to dropdown
                    const timeout = setTimeout(() => {
                      setHoveredCategory(null);
                    }, 100); // 100ms delay
                    setHoverTimeout(timeout);
                  }}
                >
                  <Link
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                    className={`flex items-center justify-between p-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors ${
                      hoveredCategory === index ? 'bg-red-50 text-red-600' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <span className="text-gray-400">›</span>
                  </Link>
                  
                  {/* Invisible bridge between sidebar and dropdown */}
                  {hoveredCategory === index && category.columns && category.columns.length > 0 && (
                    <div
                      className="absolute left-full top-0 w-2 h-full z-50"
                      onMouseEnter={() => {
                        if (hoverTimeout) {
                          clearTimeout(hoverTimeout);
                        }
                        setHoveredCategory(index);
                      }}
                    />
                  )}
                  
                  {/* Dropdown Menu - Multi-column */}
                  {hoveredCategory === index && category.columns && category.columns.length > 0 && (
                    <div
                      className="absolute left-full top-0 ml-0 bg-white shadow-2xl border border-gray-200 rounded-lg p-8 z-50"
                      style={{ 
                        minWidth: `${Math.min(category.columns.length, 4) * 200}px`,
                        maxWidth: '900px'
                      }}
                      onMouseEnter={() => {
                        // Clear timeout when mouse enters dropdown
                        if (hoverTimeout) {
                          clearTimeout(hoverTimeout);
                        }
                        setHoveredCategory(index);
                      }}
                      onMouseLeave={() => {
                        // Delay hiding dropdown
                        const timeout = setTimeout(() => {
                          setHoveredCategory(null);
                        }, 100);
                        setHoverTimeout(timeout);
                      }}
                    >
                      <div 
                        className="grid gap-8"
                        style={{ gridTemplateColumns: `repeat(${Math.min(category.columns.length, 4)}, minmax(180px, 1fr))` }}
                      >
                        {category.columns.map((column, colIndex) => (
                          <div key={colIndex} className="min-w-0">
                            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase border-b-2 border-red-600 pb-2">
                              {column.title}
                            </h3>
                            <ul className="space-y-2.5">
                              {column.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  {item.href ? (
                                    <Link
                                      href={item.href}
                                      className="text-gray-700 hover:text-red-600 text-sm block py-1.5 transition-colors whitespace-nowrap"
                                    >
                                      {item.name}
                                    </Link>
                                  ) : (
                                    <Link
                                      href={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(item.name)}`}
                                      className="text-gray-700 hover:text-red-600 text-sm block py-1.5 transition-colors whitespace-nowrap"
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="w-full">
            {/* Main Banner Section */}
        <section className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Banner */}
              <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-8 relative overflow-hidden min-h-[300px]">
                <div className="relative z-10">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-4">GIỚI THIỆU NHÀ BÁN HÀNG MỚI</h1>
                  <p className="text-lg lg:text-xl mb-2">Nhận Quà Ngay Từ Chiaki!</p>
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
              <div className="w-full lg:w-80 space-y-4">
                <div className="bg-blue-500 rounded-lg p-6 text-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <h3 className="font-bold text-lg mb-2">OBAGI SALE UPTO 30%</h3>
                  <p className="text-sm">Mỹ phẩm cao cấp</p>
                </div>
                <div className="bg-green-500 rounded-lg p-6 text-center hover:bg-green-600 transition-colors cursor-pointer">
                  <h3 className="font-bold text-lg mb-2">BLACKMORES</h3>
                  <p className="text-sm">Chăm sóc sức khỏe toàn diện</p>
                  <p className="text-yellow-300 font-bold mt-2">GIẢM TỚI 30%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vitamin Banner */}
        <section className="bg-white py-6 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-blue-600">Chiaki.vn</div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">BỔ SUNG VITAMIN VÀ KHOÁNG CHẤT</h2>
                  <p className="text-xs md:text-sm text-gray-600">MẸ BẦU KHỎE MẠNH, BÉ YÊU PHÁT TRIỂN</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <div className="text-center md:text-right">
                  <p className="text-red-600 font-bold text-lg">GIẢM TỚI 30%</p>
                  <div className="flex flex-wrap justify-center md:justify-end gap-2 mt-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs md:text-sm hover:bg-blue-600 transition-colors">VITAMIN BẦU</button>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs md:text-sm hover:bg-blue-600 transition-colors">VITAMIN SAU SINH</button>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs md:text-sm hover:bg-blue-600 transition-colors">LỢI SỮA</button>
                  </div>
                </div>
                <button className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition-colors">MUA NGAY</button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">DANH MỤC</h2>
              <button className="text-red-600 hover:text-red-700 text-sm md:text-base font-medium flex items-center">
                Xem tất cả
                <span className="ml-1">›</span>
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
              {categoryGrid.map((category, index) => (
                <div key={index} className="text-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-xl sm:text-2xl group-hover:bg-red-50 transition-colors">
                    {category.icon}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 group-hover:text-red-600 transition-colors">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flash Sale Section */}
        <section className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                  <span className="text-red-500 mr-2 text-2xl">⚡</span>
                  FLASH SALE
                </h2>
                <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm">
                  ONLY THIS WEEKEND FLASH SALE
                </div>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition-colors text-sm md:text-base">
                Xem thêm
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {products.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Popular Products Section */}
        <section className="bg-white py-8 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">SẢN PHẨM NỔI BẬT</h2>
              <button className="text-red-600 hover:text-red-700 text-sm md:text-base font-medium flex items-center">
                Xem tất cả
                <span className="ml-1">›</span>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {products.slice(6, 12).map((product) => (
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
