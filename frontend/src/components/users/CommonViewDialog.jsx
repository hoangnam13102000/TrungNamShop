import { memo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const CommonViewDialog = memo(({ title, data, avatar, open, onClose }) => {
  const safeData = Array.isArray(data) ? data : [];
  const contentRef = useRef(null);

  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-gradient-to-b from-white to-slate-50 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative border border-slate-100"
          ref={contentRef}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 z-10"
          >
            <FaTimes size={18} />
          </button>

          {/* Header */}
          <div className="text-center pb-6 border-b border-slate-100/50">
            {avatar && (
              <motion.img
                src={avatar}
                alt="avatar"
                className="w-28 h-28 mx-auto mb-4 rounded-full border-4 border-indigo-100 shadow-lg object-cover ring-2 ring-indigo-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
              />
            )}
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              {title}
            </h2>
          </div>

          {/* Content */}
          <div className="space-y-2 p-6">
            {safeData.length > 0 ? (
              safeData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white hover:bg-indigo-50/30 p-4 rounded-2xl shadow-sm hover:shadow-md border border-slate-100/50 hover:border-indigo-200/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {item.label}
                      </p>
                      <p className="text-base font-semibold text-slate-800 mt-1 break-words">
                        {item.value || "—"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">Không có dữ liệu</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

export default CommonViewDialog;