import { useState } from "react";
import AddBrand from "../AddBrand";
import logoIphone from "../../../../../assets/users/images/brands/logo-iphone.png"; 
import logoItel from "../../../../../assets/users/images/brands/logo-itel.jpg"; 
import logoMasstel from "../../../../../assets/users/images/brands/logo-masstel.png"; 
import logoNokia from "../../../../../assets/users/images/brands/logo-nokia.jpg"; 
const initialBrands = [{ id: 1, name: "IPHONE", image: logoIphone }, 
  { id: 2, name: "ITEL", image: logoItel },
  { id: 3, name: "MASSTEL", image: logoMasstel }, 
  { id: 4, name: "NOKIA", image: logoNokia },
];
export default function BrandManagement() {
  const [brands, setBrands] = useState(initialBrands);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (id) => setBrands(brands.filter((b) => b.id !== id));
  const handleAddBrand = (brand) => {
    setBrands([...brands, brand]);
    setIsAdding(false);
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isAdding) {
    return <AddBrand onAddBrand={handleAddBrand} onBack={() => setIsAdding(false)} />;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Quản lý thương hiệu</h1>

      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          + Thêm thương hiệu
        </button>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-64"
        />
      </div>

      {/* Table danh sách thương hiệu */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">STT</th>
              <th className="p-2 text-left">Tên thương hiệu</th>
              <th className="p-2 text-left">Hình ảnh</th>
              <th className="p-2 text-left">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand, index) => (
              <tr key={brand.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{brand.name}</td>
                <td className="p-2">
                  <img src={brand.image} alt={brand.name} className="h-12" />
                </td>
                <td className="p-2 flex gap-2">
                  <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
