import DisplayValue from "../common/DisplayValueNull";

/**
 * Shared table component for admin management pages
 * @param {object[]} columns - [{ field, label, render? }]
 * @param {object[]} data - data rows
 * @param {object[]} actions - [{ icon, label?, onClick, color? }]
 * @param {string[]} imageFields - list of image field names
 */
export default function AdminListTable({
  columns = [],
  data = [],
  actions = [],
  imageFields = [],
}) {
  const iconColorMap = {
    FaEye: "bg-blue-500 hover:bg-blue-600 text-white",
    FaEdit: "bg-yellow-500 hover:bg-yellow-600 text-white",
    FaSync: "bg-purple-500 hover:bg-purple-600 text-white",
    FaTrash: "bg-red-600 hover:bg-red-700 text-white",
    FaSave: "bg-green-600 hover:bg-green-700 text-white",
    FaCheck: "bg-emerald-500 hover:bg-emerald-600 text-white",
    FaPlus: "bg-indigo-500 hover:bg-indigo-600 text-white",
  };

  const getValue = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full border-collapse text-center">
        <thead className="bg-red-600 text-white text-sm">
          <tr>
            <th className="p-3 w-10">STT</th>
            {columns.map((col, idx) => (
              <th key={idx} className="p-3 whitespace-nowrap">
                {col.label}
              </th>
            ))}
            {actions.length > 0 && <th className="p-3">Hành động</th>}
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
                <td className="p-3">{index + 1}</td>

                {columns.map((col, idx) => {
                  const value = getValue(row, col.field);

                  // Custom render
                  if (col.render) return <td key={idx} className="p-3">{col.render(value, row)}</td>;

                  // Nếu là ảnh
                  if (imageFields.includes(col.field)) {
                    return (
                      <td key={idx} className="p-3">
                        <div
                          className="mx-auto w-12 h-12 rounded bg-gray-200 bg-center bg-cover border"
                          style={{
                            backgroundImage: `url(${
                              value || "https://via.placeholder.com/100x100?text=No+Image"
                            })`,
                          }}
                        ></div>
                      </td>
                    );
                  }

                  // Mặc định
                  return (
                    <td key={idx} className="p-3">
                      <DisplayValue value={value} />
                    </td>
                  );
                })}

                {actions.length > 0 && (
                  <td className="p-3 flex justify-center gap-2">
                    {actions.map((action, i) => {
                      const iconName = action.icon?.type?.name;
                      const colorClass =
                        action.color ||
                        iconColorMap[iconName] ||
                        "bg-gray-200 hover:bg-gray-300 text-gray-700";

                      return (
                        <button
                          key={i}
                          onClick={() => action.onClick?.(row)}
                          className={`p-2 rounded transition ${colorClass}`}
                          title={action.label || iconName}
                        >
                          {action.icon}
                        </button>
                      );
                    })}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions.length > 0 ? 2 : 1)}
                className="text-center py-4 text-gray-500 italic"
              >
                Không có dữ liệu.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
