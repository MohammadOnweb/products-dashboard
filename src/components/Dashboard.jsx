import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

  // Fetch products from backend
  useEffect(() => {
    fetch("https://api.jsonbin.io/v3/b/6957930fae596e708fbfd1d6", {
      headers: {
        "X-Master-Key":
          "$2a$10$oDRhsr4MAVLOawtrc.WJnu3ybugKhhHSEFQTJX1diA1bVhm.pYgsq",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.record || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  // Filter products by search
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Infinite scroll with one-by-one item loading
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
            // Stop if we reached the end
            if (prev >= filteredProducts.length) {
              clearInterval(interval);
              setIsLoadingMore(false);
              return prev;
            }

            added++;
            // Stop after adding 10 items
            if (added === 10) {
              clearInterval(interval);
              setIsLoadingMore(false);
            }

            return prev + 1;
          });
        }, 500); // 200ms per item
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadingMore, visibleCount, filteredProducts.length]);

  // Only show visible items
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  if (loading)
    return (
      <p className="text-center text-white mt-10 text-3xl">Loading...</p>
    );

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-gray-800 rounded-2xl shadow-xl text-white">
      <label className="block text-4xl font-bold uppercase text-center mb-5 tracking-wide">
        Products List
      </label>

      <input
        className="w-full text-black bg-white max-w-md block px-4 py-3 mb-8 border-2 border-green-400 rounded-lg text-lg outline-none focus:ring-2 focus:ring-green-400 transition"
        type="text"
        placeholder="Find your products"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setVisibleCount(3); // reset visible count on search
        }}
      />

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

      {/* Spinner for loading new items */}
      {isLoadingMore && (
        <div className="flex justify-center mt-6">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-green-400 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
