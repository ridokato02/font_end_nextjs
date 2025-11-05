'use client';

import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row w-full lg:w-10/12 xl:w-8/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-12 bg-no-repeat bg-cover bg-center" style={{backgroundImage: "url('/auth-bg.jpg')"}}>
            <h1 className="text-white text-3xl font-bold mb-3">Chào mừng</h1>
            <div>
              <p className="text-white">
                Khám phá thế giới mua sắm bất tận với chúng tôi. Đăng nhập để nhận được những ưu đãi độc quyền.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/2 py-16 px-12">
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
