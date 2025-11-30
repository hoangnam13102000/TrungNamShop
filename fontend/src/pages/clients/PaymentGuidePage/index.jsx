import { useState } from "react";
import { FaQrcode, FaPaypal, FaChevronDown, FaChevronUp } from "react-icons/fa";
import qrImage from "../../../assets/users/images/qrCode/my-qr-code.jpg";
export default function PaymentGuide() {
  const [expandedMomo, setExpandedMomo] = useState(false);
  const [expandedPaypal, setExpandedPaypal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Hướng Dẫn Thanh Toán</h1>
          <p className="text-red-100 text-lg">Chọn phương thức thanh toán phù hợp với bạn</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Momo Payment Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <FaQrcode className="w-8 h-8" />
                <h2 className="text-2xl md:text-3xl font-bold">Thanh Toán Momo</h2>
              </div>
              <p className="text-pink-100 mt-2">Quét mã QR hoặc nhập thủ công</p>
            </div>

            {/* QR Code Section */}
            <div className="p-6 md:p-8">
              <div className="bg-gray-50 rounded-lg p-6 md:p-8 mb-6 flex justify-center">
                <div className="w-full max-w-xs">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <img 
                      src={qrImage} 
                      alt="Mã QR thanh toán Momo"
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-3">Mã QR thanh toán Momo</p>
                </div>
              </div>

              {/* Instructions */}
              <button
                onClick={() => setExpandedMomo(!expandedMomo)}
                className="w-full bg-pink-50 hover:bg-pink-100 text-pink-900 font-semibold py-3 px-4 rounded-lg flex items-center justify-between transition-colors mb-4"
              >
                <span>Hướng Dẫn Chi Tiết</span>
                {expandedMomo ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {expandedMomo && (
                <div className="space-y-4 mb-6 bg-pink-50 p-4 rounded-lg">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Mở ứng dụng Momo</h4>
                      <p className="text-gray-700 text-sm">Mở ứng dụng Momo trên điện thoại của bạn</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Chọn Quét mã QR</h4>
                      <p className="text-gray-700 text-sm">Nhấn vào biểu tượng QR để mở camera quét</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Quét mã QR</h4>
                      <p className="text-gray-700 text-sm">Đưa camera gần mã QR ở trên để quét</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Xác nhận và thanh toán</h4>
                      <p className="text-gray-700 text-sm">Kiểm tra số tiền và nhấn xác nhận để hoàn tất</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Info */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h4 className="font-semibold text-gray-900 mb-2">Thông tin tài khoản Momo</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-gray-700">Số điện thoại:</span> <span className="text-gray-600">0123 456 789</span></p>
                  <p><span className="font-semibold text-gray-700">Tên chủ tài khoản:</span> <span className="text-gray-600">Shop ABC</span></p>
                  <p><span className="font-semibold text-gray-700">Nội dung chuyển:</span> <span className="text-gray-600">Mã đơn hàng của bạn</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* PayPal Payment Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center gap-3">
                <FaPaypal className="w-8 h-8" />
                <h2 className="text-2xl md:text-3xl font-bold">Thanh Toán PayPal</h2>
              </div>
              <p className="text-blue-100 mt-2">Thanh toán an toàn và bảo mật</p>
            </div>

            {/* PayPal Button Section */}
            <div className="p-6 md:p-8">
              <div className="bg-blue-50 rounded-lg p-6 md:p-8 mb-6 flex justify-center">
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg flex items-center gap-3">
                  <FaPaypal className="w-6 h-6" />
                  Thanh Toán qua PayPal
                </button>
              </div>

              {/* Instructions */}
              <button
                onClick={() => setExpandedPaypal(!expandedPaypal)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold py-3 px-4 rounded-lg flex items-center justify-between transition-colors mb-4"
              >
                <span>Hướng Dẫn Chi Tiết</span>
                {expandedPaypal ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {expandedPaypal && (
                <div className="space-y-4 mb-6 bg-blue-50 p-4 rounded-lg">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Nhấn nút "Thanh Toán qua PayPal"</h4>
                      <p className="text-gray-700 text-sm">Bạn sẽ được chuyển đến trang thanh toán PayPal</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Đăng nhập hoặc tạo tài khoản</h4>
                      <p className="text-gray-700 text-sm">Sử dụng email PayPal của bạn để đăng nhập</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Xác nhận địa chỉ giao hàng</h4>
                      <p className="text-gray-700 text-sm">Kiểm tra và cập nhật thông tin giao hàng nếu cần</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Chọn phương thức thanh toán</h4>
                      <p className="text-gray-700 text-sm">Chọn thẻ tín dụng, ngân hàng hoặc PayPal balance</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Xác nhận thanh toán</h4>
                      <p className="text-gray-700 text-sm">Nhấn "Hoàn tất mua hàng" để hoàn tất giao dịch</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <h4 className="font-semibold text-gray-900 mb-3">Lợi ích của PayPal</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Bảo vệ người mua 100%</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Thanh toán an toàn với mã hóa SSL</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Không chia sẻ thông tin thẻ</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Hỗ trợ nhiều loại tiền tệ</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 md:mt-16 bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">Câu Hỏi Thường Gặp</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-red-600 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2">Thanh toán Momo an toàn không?</h4>
              <p className="text-gray-700 text-sm">Có, Momo sử dụng công nghệ mã hóa tiên tiến để bảo vệ thông tin tài khoản của bạn.</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2">PayPal có hỗ trợ Việt Nam không?</h4>
              <p className="text-gray-700 text-sm">Có, PayPal hỗ trợ thanh toán từ Việt Nam với các loại thẻ tín dụng và ngân hàng.</p>
            </div>
            <div className="border-l-4 border-red-600 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2">Tôi có thể hủy thanh toán không?</h4>
              <p className="text-gray-700 text-sm">Sau khi thanh toán thành công, bạn có thể liên hệ hỗ trợ để yêu cầu hoàn tiền trong vòng 7 ngày.</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2">Phí thanh toán là bao nhiêu?</h4>
              <p className="text-gray-700 text-sm">Không có phí thanh toán từ khách hàng. Tất cả phí được chúng tôi chi trả.</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 md:mt-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl text-white p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Cần Hỗ Trợ?</h3>
          <p className="text-gray-300 mb-6">Liên hệ với đội hỗ trợ của chúng tôi nếu bạn gặp bất kỳ vấn đề nào.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm"> Email</p>
              <p className="font-semibold">support@TechPhone.com</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm"> Phone</p>
              <p className="font-semibold">0986 036 456</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Giờ Hỗ Trợ</p>
              <p className="font-semibold">8:00 - 22:00 (T2-CN)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}