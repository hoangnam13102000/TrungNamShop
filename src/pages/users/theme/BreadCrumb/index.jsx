import { memo } from "react";
import { Link } from "react-router-dom";

const BreadCrumb = ( props ) => {
  return (
    <nav className="bg-gray-50 py-3 px-4 rounded-lg text-sm font-medium text-gray-600">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-red-600 font-medium">
            Trang chủ
          </Link>
        </li>

        <li className="flex items-center space-x-2">
          <span className="text-gray-400">/</span>
          <span className="capitalize text-gray-800">{props.name}</span>
        </li>
      </ol>
    </nav>
  );
};

export default memo(BreadCrumb);
