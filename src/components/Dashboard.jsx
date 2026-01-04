import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

  //  NEW states for adding product
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // 🔹 GET products from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  //  POST product to backend
  const addProduct = async () => {
    if (!newName || !newDescription) return;

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
        }),
      });

      if (!res.ok) throw new Error("Failed to add product");

      const savedProduct = await res.json();

      // ✅ Update UI instantly
      setProducts((prev) => [savedProduct, ...prev]);

      // reset inputs
      setNewName("");
      setNewDescription("");
      setVisibleCount((prev) => prev + 1);
    } catch (err) {
      console.error("Add product error:", err);
    }
  };

  // Filter products by search
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !isLoadingMore &&
        visibleCount < filteredProducts.length
      ) {
        setIsLoadingMore(true);

        let added = 0;
        const interval = setInterval(() => {
          setVisibleCount((prev) => {
            if (prev >= filteredProducts.length) {
              clearInterval(interval);
              setIsLoadingMore(false);
              return prev;
            }

            added++;
            if (added === 10) {
              clearInterval(interval);
              setIsLoadingMore(false);
            }

            return prev + 1;
          });
        }, 500);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadingMore, visibleCount, filteredProducts.length]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  if (loading) {
    return (
      <p className="text-center text-white mt-10 text-3xl">Loading...</p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-gray-800 rounded-2xl shadow-xl text-white">
      <label className="block text-4xl font-bold uppercase text-center mb-5 tracking-wide">
        Products List
      </label>

      {/* Search */}
      <input
        className="w-full text-black bg-white max-w-md block px-4 py-3 mb-4 border-2 border-green-400 rounded-lg text-lg outline-none focus:ring-2 focus:ring-green-400 transition"
        type="text"
        placeholder="Find your products"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setVisibleCount(3);
        }}
      />

      {/*  ADD PRODUCT */}
      <input
        className="w-full text-black bg-white block px-4 py-2 mb-3 rounded-lg"
        type="text"
        placeholder="Product name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />

      <textarea
        className="w-full text-black bg-white block px-4 py-2 mb-3 rounded-lg resize-none"
        rows="3"
        placeholder="Product description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      ></textarea>

      <button
        onClick={addProduct}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg mb-8 transition"
      >
        Add
      </button>

      {/* Products list */}
      <ul className="space-y-6">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((product, index) => (
            <li
              key={product.id || index}
              className="bg-white text-gray-900 rounded-xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transform transition flex flex-col"
            >
              <strong className="text-2xl font-bold mb-2">
                {product.name}
              </strong>
              <p className="text-green-400 text-base leading-relaxed">
                {product.description}
              </p>
            </li>
          ))
        ) : (
          <li className="text-red-400 text-center italic text-lg mt-6">
            No product found
          </li>
        )}
      </ul>

      {isLoadingMore && (
        <div className="flex justify-center mt-6">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-green-400 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
