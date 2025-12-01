import { useState, useEffect } from "react";
import { FaEnvelope, FaUser, FaPhone, FaCommentDots, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { validateGeneral } from "../../../utils/forms/validate";
import { useCustomerInfo } from "../../../utils/hooks/useCustomerInfo";

const FeedbackPage = () => {
  const { customerInfo } = useCustomerInfo();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    type: "feedback",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");

  const API = import.meta.env.VITE_API_URL; // sử dụng biến môi trường

  useEffect(() => {
    if (customerInfo.name) setFormData(prev => ({
      ...prev,
      name: customerInfo.name || "",
      phone: customerInfo.phone || "",
      email: customerInfo.email || ""
    }));
  }, [customerInfo]);

  const rules = {
    name: { required: true, message: "Vui lòng nhập họ tên" },
    email: { required: true, type: "email", message: "Email không hợp lệ" },
    phone: { required: true, type: "phone", message: "Số điện thoại không hợp lệ" },
    subject: { required: true, message: "Vui lòng nhập tiêu đề" },
    message: { required: true, minLength: 10, message: "Nội dung phải có ít nhất 10 ký tự" },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async () => {
    const validationErrors = validateGeneral(formData, rules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", phone: "", subject: "", type: "feedback", message: "" });
        setErrors({});
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        setApiError(data.message || "Gửi thất bại, vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error(error);
      setApiError("Gửi thất bại, vui lòng thử lại sau.");
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", phone: "", subject: "", type: "feedback", message: "" });
    setErrors({});
    setApiError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Góp Ý & Khiếu Nại</h1>
            <p className="text-gray-600 text-base md:text-lg">
              Chúng tôi luôn lắng nghe và cải thiện để phục vụ bạn tốt hơn
            </p>
          </div>

          {isSubmitted && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-center gap-3">
              <FaCheckCircle className="text-green-500 text-2xl flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800">Gửi thành công!</h3>
                <p className="text-green-700 text-sm">Cảm ơn bạn đã gửi phản hồi. Chúng tôi sẽ xem xét và phản hồi sớm nhất.</p>
              </div>
            </div>
          )}

          {apiError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-red-700">
              {apiError}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            <div className="space-y-6">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg outline-none transition ${errors.name ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-red-500"}`}
                      placeholder="Nhập họ tên của bạn"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg outline-none transition ${errors.email ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-red-500"}`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg outline-none transition ${errors.phone ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-red-500"}`}
                    placeholder="0912345678"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Loại phản hồi <span className="text-red-500">*</span></label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-red-500 transition"
                >
                  <option value="feedback">Góp ý</option>
                  <option value="complaint">Khiếu nại</option>
                  <option value="question">Câu hỏi</option>
                  <option value="praise">Khen ngợi</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FaCommentDots className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg outline-none transition ${errors.subject ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-red-500"}`}
                    placeholder="Nhập tiêu đề ngắn gọn"
                  />
                </div>
                {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung <span className="text-red-500">*</span></label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition resize-none ${errors.message ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-red-500"}`}
                  placeholder="Mô tả chi tiết nội dung bạn muốn gửi..."
                />
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <FaPaperPlane /> Gửi phản hồi
                </button>
                <button
                  onClick={handleReset}
                  className="sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Làm mới
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
