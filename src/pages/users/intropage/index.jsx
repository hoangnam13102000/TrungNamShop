import { useState } from "react";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('about');

  const founders = [
    {
      name: "Hoàng Trung Nam",
      role: "Sinh viên",
      birthYear: "2000",
      description: "Hoàng Trung Nam, sinh năm 2000, sinh viên của trường đại học sư phạm Thành phố Hồ Chí Minh ngành công nghệ thông tin.",
      detail: "Là thành viên của dự án TrungNamStore, có vai trò là lập trình viên.",
      image: "https://via.placeholder.com/150/3B4252/FFFFFF?text=NHV"
    },
    {
      name: "Thầy Nguyễn Đỗ Thái Nguyên",
      role: "Giáo viên hướng dẫn",
      birthYear: "",
      description: "Thầy Thầy Nguyễn Đỗ Thái Nguyên, giảng viên của trường đại học sư phạm Thành phố Hồ Chí Minh.",
      detail: "",
      image: "https://via.placeholder.com/150/3B4252/FFFFFF?text=NTTT"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="inline-flex bg-white rounded-lg shadow-sm p-1 border">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-8 md:px-16 py-3 rounded-lg font-semibold text-base md:text-lg transition-all relative ${
                activeTab === 'about'
                  ? 'text-orange-500'
                  : 'text-red-500 hover:text-orange-500'
              }`}
            >
              Giới thiệu chung
              {activeTab === 'about' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('founders')}
              className={`px-8 md:px-16 py-3 rounded-lg font-semibold text-base md:text-lg transition-all relative ${
                activeTab === 'founders'
                  ? 'text-orange-500'
                  : 'text-red-500 hover:text-orange-500'
              }`}
            >
              Người sáng lập
              {activeTab === 'founders' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'about' ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  <span className="font-bold text-gray-800">Công ty TrungNamStore</span> là nhà bán lẻ số 1 về điện thoại tại Việt Nam với phương châm luôn luôn đảm bảo về chất lượng và trải nghiệm của khách hàng. TrungNamStore luôn lắng nghe, thấu hiểu những góp ý của khách hàng và thay đổi để mang những gì tốt nhất đến với khách hàng của TrungNamStore. Sự ân cần và chu đáo của nhân viên là những lời khen mà khách hàng dành tặng cho TrungNamStore.
                </p>

                <ul className="space-y-4 text-gray-700">
                  <li className="flex">
                    <span className="mr-3 text-orange-500 font-bold">•</span>
                    <span>
                      <span className="font-bold text-gray-800">TrungNamStore</span> tập trung xây dựng dịch vụ khách hàng khác biệt với chất lượng vượt trội, phù hợp với văn hoá đặt khách hàng làm trung tâm trong mọi suy nghĩ và hành động của công ty.
                    </span>
                  </li>
                  
                  <li className="flex">
                    <span className="mr-3 text-orange-500 font-bold">•</span>
                    <span>
                      <span className="font-bold text-gray-800">TrungNamStore</span> vinh dự khi liên tiếp lọt vào bảng xếp hạng TOP 100 công ty niêm yết tốt nhất Châu Á của tạp chí uy tín Forbes và là đại diện Việt Nam duy nhất trong Top 100 nhà bán lẻ hàng đầu Châu Á – Thái Bình Dương do Tạp chí bán lẻ châu Á (Retail Asia) và Tập đoàn nghiên cứu thị trường Euromonitor bình chọn.
                    </span>
                  </li>
                  
                  <li className="flex">
                    <span className="mr-3 text-orange-500 font-bold">•</span>
                    <span>
                      <span className="font-bold text-gray-800">TrungNamStore</span> nhiều năm liên có tên trong các bảng xếp hạng danh giá như TOP 100 nhà bán lẻ hàng đầu Châu Á – Thái Bình Dương (Retail Asia) và dẫn đầu TOP 100 công ty kinh doanh hiệu quả nhất Việt Nam (Nhịp Cầu Đầu Tư)... Sự phát triển của TrungNamStore cũng là một điển hình tốt được nghiên cứu tại các trường Đại học hàng đầu như Harvard, UC Berkeley, trường kinh doanh Tuck (Mỹ).
                    </span>
                  </li>
                  
                  <li className="flex">
                    <span className="mr-3 text-orange-500 font-bold">•</span>
                    <span>
                      Không chỉ là một doanh nghiệp hoạt động hiệu quả được nhìn nhận bởi nhà đầu tư và các tổ chức đánh giá chuyên nghiệp, <span className="font-bold text-gray-800">TrungNamStore</span> còn được người lao động tin yêu khi lần thứ 4 liên tiếp được vinh danh trong TOP 100 Doanh nghiệp có môi trường làm việc tốt nhất Việt Nam và là doanh nghiệp xuất sắc nhất tại giải thường Vietnam HR Awards – "Chiến lược nhân sự hiệu quả".
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              {founders.map((founder, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                        <img 
                          src={founder.image} 
                          alt={founder.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
                          {founder.name}
                        </h3>
                        <p className="text-gray-500 italic text-base md:text-lg">
                          {founder.role}
                        </p>
                      </div>

                      <div className="space-y-3 text-gray-700">
                        <p className="leading-relaxed">
                          {founder.description}
                        </p>
                        {founder.detail && (
                          <p className="leading-relaxed">
                            {founder.detail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
