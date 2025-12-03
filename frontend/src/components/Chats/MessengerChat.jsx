import { FaFacebookMessenger } from "react-icons/fa";

export default function ChatBubble({ isStacked = false }) {
  const messengerLink = "https://m.me/927998157054506";

  return (
    <div className={isStacked ? "" : "fixed bottom-6 right-6 z-50"}>
      {/* Nút Messenger */}
      <a
        href={messengerLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative"
      >
        {/* Icon Button Rounded */}
        <div className="bg-gradient-to-br from-[#0084FF] to-[#0056b8] hover:from-[#0074e8] hover:to-[#004ab8] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:shadow-2xl hover:scale-110">
          <FaFacebookMessenger className="text-2xl" />
        </div>

        {/* Text Label - Positioned absolutely, không chiếm diện tích */}
        <div className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2">
          Chat Messenger
        </div>
      </a>
    </div>
  );
}