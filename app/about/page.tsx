'use client';

import Link from 'next/link';
import { introduceService } from '../lib/introduce';
import { useEffect, useState } from 'react';
import { Introduce } from '../types/introduce';

export default function AboutPage() {
  const [introduce, setIntroduce] = useState<Introduce[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchIntroduce = async () => {
      try {
        const response = await introduceService.getAllIntroduce();
        setIntroduce(response.data);
      } catch (error) {
        console.error('Error fetching introduce:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIntroduce();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (introduce.length === 0) {
    return <div>No introduce found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {introduce[0].Title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {introduce[0].description}
            </p>
          </div>

          {/* About Content */}
          <div className="space-y-12">
            {/* Our Story */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                {introduce[1].Title}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {introduce[1].description}
              </div>
            </section>

            {/* Our Mission */}
            <section className="bg-red-50 rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                {introduce[2].Title}
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {introduce[2].Title}
                  </h3>
                  <p className="text-gray-600">
                    {introduce[2].description}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {introduce[3].Title}
                  </h3>
                  <p className="text-gray-600">
                      {introduce[3].description}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                  <div className="text-4xl mb-4">❤️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {introduce[4].Title}
                  </h3>
                  <p className="text-gray-600">
                    {introduce[4].description}
                  </p>
                </div>
              </div>
            </section>

            {/* Our Values */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                {introduce[5].Title}
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {introduce[5].Title}
                    </h3>
                    <p className="text-gray-600">
                      {introduce[5].description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {introduce[6].Title}
                    </h3>
                    <p className="text-gray-600">
                      {introduce[6].description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {introduce[6].Title}
                    </h3>
                    <p className="text-gray-600">
                      {introduce[6].description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {introduce[3].Title}
                    </h3>
                    <p className="text-gray-600">
                      {introduce[3].description}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-md p-8 text-white">
              <h2 className="text-3xl font-bold mb-6 text-center">
                {introduce[0].Title}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">🚚</div>
                  <h3 className="text-lg font-semibold mb-2">Giao hàng nhanh</h3>
                  <p className="text-red-100 text-sm">
                    Miễn phí vận chuyển cho đơn hàng trên 300.000đ
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🛡️</div>
                  <h3 className="text-lg font-semibold mb-2">Bảo hành chính hãng</h3>
                  <p className="text-red-100 text-sm">
                    Tất cả sản phẩm đều có chế độ bảo hành đầy đủ
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">↩️</div>
                  <h3 className="text-lg font-semibold mb-2">Đổi trả dễ dàng</h3>
                  <p className="text-red-100 text-sm">
                    Chính sách đổi trả linh hoạt trong 7 ngày
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📞</div>
                  <h3 className="text-lg font-semibold mb-2">Hỗ trợ 24/7</h3>
                  <p className="text-red-100 text-sm">
                    Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn
                  </p>
                </div>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Hãy liên hệ với chúng tôi
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Liên hệ ngay
                </Link>
                <Link
                  href="/products"
                  className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Xem sản phẩm
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
