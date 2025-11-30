import { useEffect, useState } from "react";

export default function Recommendations({ productId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/recommendations/${productId}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setProducts(data.data));
  }, [productId]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {products.map(({ product }) => (
        <div key={product.id} className="border p-2 rounded shadow hover:shadow-lg">
          <img
            src={product.images[0]?.image_path || '/placeholder.png'}
            alt={product.name}
            className="w-full h-48 object-cover rounded"
          />
          <h3 className="mt-2 font-bold">{product.name}</h3>
          <p className="text-gray-500">{product.brand.name}</p>
        </div>
      ))}
    </div>
  );
}
