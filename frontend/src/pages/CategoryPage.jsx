import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { imageUrl } from "@/lib/utils";
import ProductCard from "@/components/shared/ProductCard";
import ContactButtons from "@/components/shared/ContactButtons";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/categories/${slug}`).catch(() => ({ data: null })),
      api.get("/products", { params: { category: slug } }).catch(() => ({ data: [] })),
    ]).then(([c, p]) => {
      setCategory(c.data);
      setProducts(p.data);
      setLoading(false);
    });
  }, [slug]);

  return (
    <div className="container-page section-y" data-testid="category-page">
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-[#666666] hover:text-[#111111]">
        <ArrowLeft className="h-4 w-4" /> До каталогу
      </Link>

      {loading ? (
        <div className="mt-8 surface-card h-64 animate-pulse" />
      ) : !category ? (
        <div className="mt-10 text-center">
          <h1 className="font-heading font-semibold text-2xl">Категорію не знайдено</h1>
        </div>
      ) : (
        <>
          <div className="mt-8 surface-card overflow-hidden grid md:grid-cols-[1fr_420px] gap-8 items-center">
            <div className="p-6 sm:p-10">
              <div className="eyebrow"><span className="h-1 w-1 rounded-full bg-[#111111]" /> Категорія</div>
              <h1 className="mt-4 font-heading font-semibold text-[#111111] text-3xl sm:text-4xl lg:text-[44px] leading-[1.05] tracking-tight">{category.title}</h1>
              <p className="mt-4 text-[#666666] text-base sm:text-lg leading-relaxed">{category.shortDescription}</p>
              <div className="mt-6">
                <ContactButtons />
              </div>
            </div>
            <div className="aspect-[4/3] md:aspect-auto md:h-full bg-[#F1F1EF]">
              <img src={imageUrl(category.image)} alt={category.title} className="w-full h-full object-cover img-neutral" />
            </div>
          </div>

          <div className="mt-12">
            {products.length === 0 ? (
              <div className="surface-card p-12 text-center">
                <h3 className="font-heading font-semibold text-xl">Товарів в цій категорії поки немає</h3>
                <p className="mt-2 text-sm text-[#666666]">Напишіть нам — допоможемо з підбором.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6">
                {products.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
