import { useEffect, useState } from "react";

export default function Recommendations({ productId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_API_URL; 
  useEffect(() => {
    if (!productId) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API}/recommendations/${productId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const result = await res.json();

        if (res.ok) {
          setProducts(result.data || []);
        } else {
          setError(result.message || "Failed to load recommendations.");
        }
      } catch {
        setError("Cannot connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productId, API]);

  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {products.map(({ product }) => (
        <div key={product.id} className="border p-2 rounded shadow hover:shadow-lg">
          <img
            src={product.images?.[0]?.image_path || '/placeholder.png'}
            alt={product.name}
            className="w-full h-48 object-cover rounded"
          />
          <h3 className="mt-2 font-bold">{product.name}</h3>
          <p className="text-gray-500">{product.brand?.name}</p>
        </div>
      ))}
    </div>
  );
}
