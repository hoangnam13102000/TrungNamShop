import { memo } from "react";
import { Link } from "react-router-dom";

const BreadCrumb = ({ paths = [] }) => {
  if (!paths.length) return null;

  return (
    <nav className="bg-gray-50 py-3 px-4 rounded-lg text-sm font-medium text-gray-600">
      <ol className="flex items-center space-x-2 flex-wrap">
        {paths.map((path, index) => (
          <li key={index} className="flex items-center space-x-2">
            {index > 0 && <span className="text-gray-400">/</span>}
            {path.to ? (
              <Link to={path.to} className="hover:text-red-600 font-medium capitalize">
                {path.name}
              </Link>
            ) : (
              <span className="text-gray-800 capitalize">{path.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default memo(BreadCrumb);
