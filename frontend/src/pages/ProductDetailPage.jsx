import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Send, MessageCircle, Phone, Check, Tag, Shield, Truck, Wrench } from "lucide-react";
import { api } from "@/lib/api";
import { useSettings } from "@/lib/settings-context";
import { telegramUrl, whatsappUrl, telUrl } from "@/lib/cta";
import { CATEGORY_LABELS } from "@/lib/constants";
import { imageUrl } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";
import ProductCard from "@/components/shared/ProductCard";

const BENEFITS = [
  { icon: Shield, label: "Гарантія 12 місяців" },
  { icon: Truck, label: "Доставка по Україні" },
  { icon: Wrench, label: "Консультація при монтажі" },
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { settings } = useSettings();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    setLoading(true);
    setProduct(null);
    api.get(`/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
        setMainImage(res.data.image);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    api.get("/products", { params: { category: product.category } }).then((res) => {
      setRelated(res.data.filter((p) => p.slug !== product.slug).slice(0, 3));
    });
  }, [product]);

  if (loading) {
    return (
      <div className="container-page section-y">
        <div className="surface-card h-96 animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page section-y text-center" data-testid="product-not-found">
        <h1 className="font-heading font-semibold text-2xl">Товар не знайдено</h1>
        <p className="mt-2 text-[#666666]">Можливо, він був видалений або посилання некоректне.</p>
        <Link to="/catalog" className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-[14px] bg-[#111111] text-white">
          <ChevronLeft className="h-4 w-4" /> До каталогу
        </Link>
      </div>
    );
  }

  const gallery = [product.image, ...(product.gallery || [])].filter(
    (v, i, arr) => v && arr.indexOf(v) === i
  );

  return (
    <div className="container-page section-y pb-24 lg:pb-24" data-testid="product-detail-page">
      <div className="flex items-center gap-1.5 text-sm text-[#666666]">
        <Link to="/" className="hover:text-[#111111]">Головна</Link>
        <span>·</span>
        <Link to="/catalog" className="hover:text-[#111111]">Каталог</Link>
        <span>·</span>
        <Link to={`/categories/${product.category}`} className="hover:text-[#111111]">
          {CATEGORY_LABELS[product.category]}
        </Link>
      </div>

      <div className="mt-5 sm:mt-6 grid lg:grid-cols-[1fr_400px] gap-6 sm:gap-10">
        <div>
          <div className="surface-card overflow-hidden p-3 sm:p-4">
            <div className="rounded-[16px] sm:rounded-[20px] bg-[#F1F1EF] overflow-hidden aspect-[4/3]">
              <img src={imageUrl(mainImage || product.image)} alt={product.title} className="w-full h-full object-cover img-neutral" />
            </div>
            {gallery.length > 1 ? (
              <div className="mt-2.5 sm:mt-3 grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(g)}
                    className={`rounded-[10px] sm:rounded-[12px] overflow-hidden aspect-square border-2 transition-colors ${
                      (mainImage || product.image) === g ? "border-[#111111]" : "border-transparent hover:border-[#E7E7E7]"
                    }`}
                    aria-label={`Зображення ${i + 1}`}
                  >
                    <img src={imageUrl(g)} alt="" className="w-full h-full object-cover img-neutral" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-6 sm:mt-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] rounded-full bg-[#F1F1EF] border border-[#E7E7E7] px-2.5 sm:px-3 py-1 text-[#111111] inline-flex items-center gap-1.5">
                <Tag className="h-3 w-3" /> {CATEGORY_LABELS[product.category]}
              </span>
              {product.badge ? (
                <span className="text-[10px] sm:text-[11px] rounded-full bg-[#111111] text-white px-2.5 sm:px-3 py-1 font-semibold uppercase tracking-[0.08em]">
                  {product.badge}
                </span>
              ) : null}
              <StatusBadge status={product.status} />
            </div>
            <h1 className="font-heading font-semibold text-[#111111] text-[26px] sm:text-4xl lg:text-[44px] leading-[1.08] sm:leading-[1.05] tracking-tight" data-testid="product-detail-title">
              {product.title}
            </h1>
            <p className="mt-3 sm:mt-4 text-[#666666] text-[15px] sm:text-base lg:text-lg leading-relaxed">{product.shortDescription}</p>

            {product.fullDescription ? (
              <div className="mt-8 surface-card p-6 sm:p-7">
                <h3 className="font-heading font-semibold text-lg tracking-tight">Опис</h3>
                <p className="mt-3 text-[#666666] leading-relaxed whitespace-pre-wrap">{product.fullDescription}</p>
              </div>
            ) : null}

            {product.vehicleTypes && product.vehicleTypes.length > 0 ? (
              <div className="mt-5 surface-card p-6 sm:p-7">
                <h3 className="font-heading font-semibold text-lg tracking-tight">Сумісність</h3>
                <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                  {product.vehicleTypes.map((v) => (
                    <li key={v} className="inline-flex items-center gap-2 text-sm text-[#111111]">
                      <Check className="h-4 w-4 text-[#111111]" /> {v}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-5 surface-card p-6 sm:p-7">
              <h3 className="font-heading font-semibold text-lg tracking-tight">Що входить у ціну</h3>
              <ul className="mt-4 grid sm:grid-cols-3 gap-3">
                {BENEFITS.map((b) => (
                  <li key={b.label} className="inline-flex items-center gap-3 rounded-[14px] border border-[#E7E7E7] bg-[#F7F7F5] p-4">
                    <span className="h-9 w-9 rounded-[10px] bg-white grid place-items-center border border-[#E7E7E7]">
                      <b.icon className="h-4 w-4 text-[#111111]" strokeWidth={1.75} />
                    </span>
                    <span className="text-sm font-medium text-[#111111]">{b.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sticky contact sidebar */}
        <aside className="hidden lg:block">
          <div className="surface-card p-6 sticky top-24" data-testid="product-sticky-contact-sidebar">
            <div className="flex items-center justify-between">
              <StatusBadge status={product.status} />
              {product.badge ? (
                <span className="text-[11px] rounded-full bg-[#111111] text-white px-3 py-1 font-semibold uppercase tracking-[0.08em]">
                  {product.badge}
                </span>
              ) : null}
            </div>
            <h3 className="mt-5 font-heading font-semibold text-xl tracking-tight">Запитати ціну</h3>
            <p className="text-sm text-[#666666] mt-1.5 leading-relaxed">
              Підберемо під конкретне авто та підкажемо термін виготовлення.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={telegramUrl(settings, product.title)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 rounded-[14px] text-sm font-medium bg-[#111111] text-white hover:bg-[#2A2A2A]"
                data-testid="product-sticky-telegram-button"
              >
                <Send className="h-4 w-4" /> Telegram
              </a>
              <a
                href={whatsappUrl(settings, product.title)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 rounded-[14px] text-sm font-medium bg-white text-[#111111] border border-[#E7E7E7] hover:bg-[#F1F1EF]"
                data-testid="product-sticky-whatsapp-button"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              {settings?.phone ? (
                <a
                  href={telUrl(settings)}
                  className="inline-flex items-center justify-center gap-2 h-12 rounded-[14px] text-sm font-medium bg-white text-[#111111] border border-[#E7E7E7] hover:bg-[#F1F1EF]"
                  data-testid="product-sticky-call-button"
                >
                  <Phone className="h-4 w-4" /> {settings.phone}
                </a>
              ) : null}
            </div>

            <div className="hairline my-6" />

            <ul className="flex flex-col gap-3">
              {BENEFITS.map((b) => (
                <li key={b.label} className="inline-flex items-center gap-3 text-sm text-[#111111]">
                  <b.icon className="h-4 w-4 text-[#111111]" strokeWidth={1.75} />
                  {b.label}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E7E7E7] p-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] flex gap-2" data-testid="product-mobile-bottom-cta">
        <a
          href={telegramUrl(settings, product.title)}
          target="_blank"
          rel="noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-[14px] text-sm font-medium bg-[#111111] text-white"
        >
          <Send className="h-4 w-4" /> Telegram
        </a>
        <a
          href={whatsappUrl(settings, product.title)}
          target="_blank"
          rel="noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-[14px] text-sm font-medium bg-white text-[#111111] border border-[#E7E7E7]"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        {settings?.phone ? (
          <a
            href={telUrl(settings)}
            className="w-14 h-12 rounded-[14px] bg-white border border-[#E7E7E7] text-[#111111] grid place-items-center"
            aria-label="Дзвінок"
          >
            <Phone className="h-5 w-5" />
          </a>
        ) : null}
      </div>

      {related.length > 0 ? (
        <div className="mt-20 pb-24 lg:pb-0">
          <h2 className="font-heading font-semibold text-3xl text-[#111111] tracking-tight">Схожі рішення</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((r) => (
              <ProductCard key={r.slug} product={r} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
