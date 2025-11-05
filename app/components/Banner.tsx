'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Banner as BannerType } from '../types/asset';
import { assetService } from '../lib/asset';

export default function Banner() {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await assetService.getActiveBanners();
        setBanners(response.data);
        if (response.data.length > 0) {
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [autoPlay, banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  if (loading) {
    return (
      <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];
  const imageUrl = currentBanner.image?.url || '/placeholder-banner.jpg';

  return (
    <div className="relative w-full mb-6 rounded-lg overflow-hidden shadow-md group">
      {/* Banner Image */}
      <div className="relative w-full h-64 md:h-96 lg:h-[500px]">
        {currentBanner.link ? (
          <Link href={currentBanner.link} className="block w-full h-full">
            <Image
              src={imageUrl}
              alt={currentBanner.image?.alternativeText || currentBanner.title || 'Banner'}
              fill
              className="object-cover"
              priority={currentIndex === 0}
              sizes="100vw"
            />
          </Link>
        ) : (
          <Image
            src={imageUrl}
            alt={currentBanner.image?.alternativeText || currentBanner.title || 'Banner'}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="100vw"
          />
        )}

        {/* Overlay with title and description (optional) */}
        {(currentBanner.title || currentBanner.description) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
            <div className="w-full p-6 md:p-8 text-white">
              {currentBanner.title && (
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{currentBanner.title}</h2>
              )}
              {currentBanner.description && (
                <p className="text-sm md:text-lg opacity-90">{currentBanner.description}</p>
              )}
            </div>
          </div>
        )}

        {/* Navigation Arrows - Only show if more than 1 banner */}
        {banners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Previous banner"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Next banner"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

