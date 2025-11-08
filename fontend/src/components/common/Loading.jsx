import { useIsFetching } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Loading() {
  const isFetching = useIsFetching();
  const [showLoading, setShowLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isFetching > 0 && !hasLoaded) {
      setShowLoading(true);
    }
    if (isFetching === 0 && showLoading) {
      setShowLoading(false);
      setHasLoaded(true); // đánh dấu lần đầu load đã xong
    }
  }, [isFetching, showLoading, hasLoaded]);

  return (
    <AnimatePresence>
      {showLoading && (
        <motion.div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Spinner */}
            <div className="relative w-12 h-12">
              <motion.div className="absolute inset-0 border-2 border-gray-300 rounded-full" />
              <motion.div
                className="absolute inset-0 border-2 border-transparent border-t-green-800 border-r-green-800 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </div>

            <motion.p
              className="text-gray-700 text-sm font-medium"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Đang tải...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
