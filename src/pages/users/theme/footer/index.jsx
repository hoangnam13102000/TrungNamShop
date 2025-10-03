import { memo } from "react";
import {
  FaFacebookSquare,
  FaYoutube,
  FaInstagramSquare,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white mt-10">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột 1: Introduce */}
          <div>
            <h3 className="text-lg font-semibold mb-3">PhoneStore</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              PhoneStore chuyên cung cấp điện thoại chính hãng, giá tốt nhất thị
              trường. <br />
              <span className="italic">Uy tín – Chất lượng – Bảo hành tận tâm.</span>
            </p>
          </div>

          {/* Cột 2: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Liên hệ</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-yellow-400" />
                <span>Hotline: 1800 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-yellow-400" />
                <span>support@phonestore.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-yellow-400" />
                <span>Đường số 7, Hiệp Bình Phước, Q.Thủ Đức, TP.HCM</span>
              </li>
            </ul>
          </div>

          {/* Cột 3: Support */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="hover:text-yellow-400">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="/policy" className="hover:text-yellow-400">
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a href="/shipping" className="hover:text-yellow-400">
                  Chính sách giao hàng
                </a>
              </li>
              <li>
                <a href="/payment" className="hover:text-yellow-400">
                  Hướng dẫn thanh toán
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Promotions & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Khuyến mãi & Ưu đãi</h3>
            <p className="text-sm opacity-90 mb-3">
              Đăng ký email để nhận tin khuyến mãi và ưu đãi mới nhất.
            </p>
            {/* Registration form */}
            <form className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-3 py-2 rounded-md text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-medium px-4 py-2 rounded-md text-sm transition-colors"
              >
                Đăng ký
              </button>
            </form>

            {/* Social */}
            <div className="flex space-x-2">
              <a
                href="https://facebook.com/phonestore"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-blue-600 p-2.5 rounded-md transition-all"
              >
                <FaFacebookSquare size={18} />
              </a>
              <a
                href="https://youtube.com/@phonestore"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-red-600 p-2.5 rounded-md transition-all"
              >
                <FaYoutube size={18} />
              </a>
              <a
                href="https://instagram.com/phonestore"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-pink-500 p-2.5 rounded-md transition-all"
              >
                <FaInstagramSquare size={18} />
              </a>
              <a
                href="https://twitter.com/phonestore"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-sky-500 p-2.5 rounded-md transition-all"
              >
                <FaTwitter size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-4 text-center text-xs opacity-80">
          © {new Date().getFullYear()} PhoneStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
