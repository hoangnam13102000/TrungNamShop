import { FaEdit, FaTrash } from "react-icons/fa";
/**
 * Shared table component for the admin page
 * @param {object[]} columns - Array of columns with {field, label} (e.g., [{field: "image", label: "Image"}, {field: "name", label: "Name"}])
 * @param {object[]} data - Data to display
 * @param {function} onEdit - Function to call when the edit button is clicked
 * @param {function} onDelete - Function to call when the delete button is clicked
 * @param {string[]} imageFields - Fields that contain images (default: [])
 */
export default function AdminListTable({
    columns = [],
    data = [],
    onEdit,
    onDelete,
    imageFields = [],
}) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="min-w-full border-collapse">
                <thead className="bg-red-600 text-white text-sm">
                    <tr>
                        <th className="p-3 text-center w-10">#</th>
                        {columns.map((col, idx) => (
                            <th key={idx} className="p-3 text-left whitespace-nowrap">
                                {col.label}
                            </th>
                        ))}
                        <th className="p-3 text-center">Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <tr
                                key={row.id || index}
                                className={`border-b hover:bg-gray-50 ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                            >
                                <td className="p-3 text-center">{index + 1}</td>

                                {/* Browse by columns order */}
                                {columns.map((col, idx) => {
                                    const value = row[col.field];
                                    return (
                                        <td key={idx} className="p-3 text-left">
                                            {imageFields.includes(col.field) ? (
                                                <div
                                                    className="w-12 h-12 rounded bg-gray-200 bg-center bg-cover border"
                                                    style={{
                                                        backgroundImage: `url(${
                                                            value ||
                                                            "https://via.placeholder.com/100x100?text=No+Image"
                                                        })`,
                                                    }}
                                                ></div>
                                            ) : col.field === "status" ? (
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${
                                                        value === "Đang bán"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-200 text-gray-600"
                                                    }`}
                                                >
                                                    {value}
                                                </span>
                                            ) : (
                                                <span
                                                    className={`${
                                                        typeof value === "string" &&
                                                        value.length > 50
                                                            ? "truncate block max-w-xs"
                                                            : ""
                                                    }`}
                                                >
                                                    {value}
                                                </span>
                                            )}
                                        </td>
                                    );
                                })}

                                <td className="p-3 flex justify-center gap-2">
                                    <button
                                        onClick={() => onEdit && onEdit(row)}
                                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                        title="Sửa"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => onDelete && onDelete(row.id)}
                                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                        title="Xóa"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + 2}
                                className="text-center py-4 text-gray-500 italic"
                            >
                                Không có dữ liệu để hiển thị.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}