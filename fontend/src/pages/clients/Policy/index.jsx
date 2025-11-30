import React, { useState } from 'react'
import { 
  FaShieldAlt, 
  FaMobileAlt, 
  FaClock, 
  FaCheckCircle,
  FaTimesCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaFileContract,
  FaTools,
  FaUserCog
} from 'react-icons/fa'

const WarrantyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const warrantyFeatures = [
    {
      icon: <FaShieldAlt className="text-2xl text-blue-600" />,
      title: 'Bảo Hành Chính Hãng',
      description: 'Tất cả sản phẩm đều được bảo hành chính hãng từ nhà sản xuất với đầy đủ quyền lợi'
    },
    {
      icon: <FaMobileAlt className="text-2xl text-green-600" />,
      title: 'Đổi Mới 30 Ngày',
      description: 'Đổi mới sản phẩm trong vòng 30 ngày nếu phát hiện lỗi kỹ thuật từ nhà sản xuất'
    },
    {
      icon: <FaClock className="text-2xl text-orange-600" />,
      title: 'Hỗ Trợ 24/7',
      description: 'Đội ngũ kỹ thuật viên chuyên nghiệp hỗ trợ 24/7 cho mọi vấn đề kỹ thuật'
    },
    {
      icon: <FaTools className="text-2xl text-purple-600" />,
      title: 'Sửa Chữa Nhanh',
      description: 'Thời gian sửa chữa tối đa 7 ngày làm việc, cam kết không kéo dài'
    },
    {
      icon: <FaUserCog className="text-2xl text-red-600" />,
      title: 'Kỹ Thuật Viên Chuyên Nghiệp',
      description: 'Đội ngũ kỹ thuật được đào tạo chuyên sâu, có chứng chỉ từ nhà sản xuất'
    },
    {
      icon: <FaFileContract className="text-2xl text-teal-600" />,
      title: 'Hồ Sơ Minh Bạch',
      description: 'Quy trình bảo hành rõ ràng, hồ sơ đầy đủ và minh bạch với khách hàng'
    }
  ]

  const warrantyTerms = [
    {
      title: "Thời Gian Bảo Hành",
      content: "• iPhone: 12 tháng chính hãng Apple\n• Samsung: 24 tháng toàn cầu\n• Vivo: 18 tháng chính hãng\n• Oppo: 15 tháng hệ thống\n• Xiaomi: 12 tháng chính hãng"
    },
    {
      title: "Điều Kiện Bảo Hành",
      content: "• Sản phẩm còn nguyên tem bảo hành\n• IMEI/Serial number khớp với hóa đơn\n• Không có dấu hiệu thấm nước, va đập\n• Không tự ý sửa chữa, can thiệp phần cứng\n• Hóa đơn mua hàng hợp lệ"
    },
    {
      title: "Quy Trình Bảo Hành",
      content: "Bước 1: Tiếp nhận sản phẩm và kiểm tra điều kiện bảo hành\nBước 2: Xác nhận lỗi và lập phiếu bảo hành\nBước 3: Chuyển sản phẩm đến trung tâm bảo hành\nBước 4: Sửa chữa và kiểm tra chất lượng\nBước 5: Bàn giao sản phẩm cho khách hàng"
    }
  ]

  const coveredItems = [
    'Lỗi phần cứng từ nhà sản xuất',
    'Lỗi phần mềm hệ thống',
    'Màn hình cảm ứng (lỗi kỹ thuật)',
    'Pin (trong điều kiện bảo hành)',
    'Loa, micro và camera',
    'Mainboard, linh kiện điện tử',
    'Các lỗi vận hành hệ thống'
  ]

  const notCoveredItems = [
    'Màn hình vỡ, trầy xước do tác động ngoại lực',
    'Thấm nước, ẩm ướt, oxy hóa',
    'Sản phẩm đã qua sửa chữa trái phép',
    'Hư hỏng do thiên tai, sét đánh, cháy nổ',
    'Phụ kiện đi kèm (cáp, tai nghe, củ sạc)',
    'Sản phẩm hết thời hạn bảo hành',
    'Lỗi do sử dụng không đúng hướng dẫn'
  ]

  const serviceCenters = [
    {
      location: "Hà Nội",
      address: "123 Trần Duy Hưng, Cầu Giấy",
      phone: "024 1234 5678",
      hours: "8:00 - 18:00 (Thứ 2 - Chủ Nhật)"
    },
    {
      location: "TP.HCM",
      address: "456 Nguyễn Văn Linh, Quận 7",
      phone: "028 8765 4321",
      hours: "8:00 - 18:00 (Thứ 2 - Chủ Nhật)"
    },
    {
      location: "Đà Nẵng",
      address: "789 Trần Phú, Hải Châu",
      phone: "0236 1357 2468",
      hours: "8:00 - 17:00 (Thứ 2 - Thứ 7)"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">


      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Chính Sách Bảo Hành Toàn Diện
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Cam kết bảo hành chính hãng với quy trình minh bạch, thời gian nhanh chóng và dịch vụ chuyên nghiệp
          </p>
        </section>

        {/* Warranty Features */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Dịch Vụ Bảo Hành Ưu Việt
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warrantyFeatures.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    {item.title}
                  </h4>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Warranty Terms */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Điều Khoản Bảo Hành
            </h3>
            <div className="space-y-6">
              {warrantyTerms.map((term, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleSection(`term-${index}`)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 rounded-lg"
                  >
                    <span className="text-xl font-semibold text-gray-800">{term.title}</span>
                    {expandedSections[`term-${index}`] ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {expandedSections[`term-${index}`] && (
                    <div className="px-6 pb-4">
                      <pre className="text-gray-600 whitespace-pre-wrap font-sans">
                        {term.content}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage Details */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Covered Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FaCheckCircle className="text-2xl text-green-500" />
              <h3 className="text-2xl font-bold text-gray-800">Phạm Vi Bảo Hành</h3>
            </div>
            <ul className="space-y-3">
              {coveredItems.map((item, index) => (
                <li key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Covered Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FaTimesCircle className="text-2xl text-red-500" />
              <h3 className="text-2xl font-bold text-gray-800">Không Thuộc Phạm Vi Bảo Hành</h3>
            </div>
            <ul className="space-y-3">
              {notCoveredItems.map((item, index) => (
                <li key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <FaTimesCircle className="text-red-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Service Centers */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Trung Tâm Bảo Hành
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {serviceCenters.map((center, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">{center.location}</h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-start space-x-2">
                      <FaMapMarkerAlt className="text-blue-600 flex-shrink-0 mt-1" />
                      <span>{center.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaPhoneAlt className="text-green-600" />
                      <span>{center.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-orange-600" />
                      <span>{center.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Câu Hỏi Thường Gặp
          </h3>
          <div className="space-y-4">
            {[
              {
                question: "Làm thế nào để kiểm tra tình trạng bảo hành sản phẩm?",
                answer: "Bạn có thể kiểm tra tình trạng bảo hành bằng nhiều cách:\n• Truy cập website và nhập IMEI/serial number\n• Liên hệ hotline 1800 1234\n• Đến trực tiếp trung tâm bảo hành\n• Quét mã QR trên tem bảo hành"
              },
              {
                question: "Thời gian sửa chữa bảo hành thông thường là bao lâu?",
                answer: "Thời gian sửa chữa phụ thuộc vào tình trạng lỗi:\n• Lỗi nhẹ: 3-5 ngày làm việc\n• Lỗi phần cứng phức tạp: 7-10 ngày làm việc\n• Cần thay thế linh kiện: 10-14 ngày làm việc\nChúng tôi cam kết thông báo cụ thể thời gian dự kiến khi tiếp nhận sản phẩm."
              },
              {
                question: "Có thể bảo hành tại bất kỳ chi nhánh nào?",
                answer: "Có, bạn có thể đến bất kỳ trung tâm bảo hành nào của chúng tôi trên toàn quốc. Hệ thống được kết nối tập trung, đảm bảo quy trình đồng bộ và chất lượng dịch vụ như nhau tại mọi điểm."
              },
              {
                question: "Cần mang theo gì khi đi bảo hành?",
                answer: "Khi đến trung tâm bảo hành, vui lòng mang theo:\n• Sản phẩm cần bảo hành\n• Hóa đơn mua hàng (bản gốc hoặc bản sao)\n• Phiếu bảo hành (nếu có)\n• Các phụ kiện đi kèm liên quan đến lỗi"
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection(`faq-${index}`)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 rounded-lg"
                >
                  <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
                  {expandedSections[`faq-${index}`] ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {expandedSections[`faq-${index}`] && (
                  <div className="px-6 pb-4">
                    <pre className="text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">
                      {faq.answer}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Cần Hỗ Trợ Về Bảo Hành?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg">
              Đội ngũ chuyên viên bảo hành của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="text-xl" />
                <div>
                  <p className="text-sm text-blue-200">Hotline Bảo Hành</p>
                  <p className="font-semibold text-lg">1800 1234</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-xl" />
                <div>
                  <p className="text-sm text-blue-200">Email Hỗ Trợ</p>
                  <p className="font-semibold text-lg">warranty@store.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaClock className="text-xl" />
                <div>
                  <p className="text-sm text-blue-200">Thời Gian Làm Việc</p>
                  <p className="font-semibold text-lg">24/7</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">&copy; 2024 Cửa Hàng Điện Thoại. Tất cả các quyền được bảo lưu.</p>
          <p className="text-gray-400 mt-2">
            Chính sách bảo hành có thể được cập nhật. Vui lòng liên hệ để được tư vấn chi tiết và chính xác nhất.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default WarrantyPolicy