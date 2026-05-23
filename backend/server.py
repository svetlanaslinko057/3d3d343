from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import base64
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuid
import re
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT config
JWT_SECRET = os.environ.get('JWT_SECRET', 'pnevmo-super-secret-change-in-production-2026')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRE_DAYS = 7

security = HTTPBearer(auto_error=False)

# Create the main app without a prefix
app = FastAPI(title="Pnevmo Catalog API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============================================================
# Models
# ============================================================

ProductCategoryType = Literal['air-springs', 'air-suspension', 'components', 'installation', 'custom-solutions', 'by-vehicle']
ProductStatusType = Literal['in_stock', 'on_order']


class ProductBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    slug: str
    category: ProductCategoryType
    shortDescription: str
    fullDescription: Optional[str] = ""
    image: str
    gallery: List[str] = Field(default_factory=list)
    status: ProductStatusType = 'in_stock'
    badge: Optional[str] = None
    vehicleTypes: List[str] = Field(default_factory=list)
    featured: bool = False
    isPublished: bool = True
    sortOrder: int = 0


class Product(ProductBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[ProductCategoryType] = None
    shortDescription: Optional[str] = None
    fullDescription: Optional[str] = None
    image: Optional[str] = None
    gallery: Optional[List[str]] = None
    status: Optional[ProductStatusType] = None
    badge: Optional[str] = None
    vehicleTypes: Optional[List[str]] = None
    featured: Optional[bool] = None
    isPublished: Optional[bool] = None
    sortOrder: Optional[int] = None


class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    shortDescription: str
    image: str
    icon: str = 'Package'
    order: int = 0


class LeadCreate(BaseModel):
    name: str
    phone: str
    message: Optional[str] = ""
    product_slug: Optional[str] = None
    product_title: Optional[str] = None


class Lead(LeadCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    isRead: bool = False


class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "site-settings"
    company_name: str = "ПНЕВМО ПРО"
    telegram_username: str = "RPUA_Support"
    whatsapp_number: str = "380737662545"
    phone: str = "+380 73 766 25 45"
    email: str = "Pnevmoresora@gmail.com"
    city: str = "Київ"
    country: str = "Україна"
    working_hours: str = "Пн-Пт: 09:00-19:00, Сб: 10:00-16:00"
    address: str = "м. Київ, Україна (доставка по всій країні)"
    tagline: str = "Виробництво пневмоподушок · Україна · 20 років. Опт · Дилери · OEM · Роздріб від виробника"


class SiteSettingsUpdate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    company_name: Optional[str] = None
    telegram_username: Optional[str] = None
    whatsapp_number: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    working_hours: Optional[str] = None
    address: Optional[str] = None
    tagline: Optional[str] = None


class AdminLogin(BaseModel):
    email: str
    password: str


class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin_email: str


class FAQItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    order: int = 0


class ImageUploadResponse(BaseModel):
    url: str


# ============================================================
# Helpers
# ============================================================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Не авторизовано")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Невалідний токен")
        admin = await db.admins.find_one({"email": email}, {"_id": 0})
        if not admin:
            raise HTTPException(status_code=401, detail="Адміністратора не знайдено")
        return admin
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Токен прострочений")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Невалідний токен")


def slugify(text: str) -> str:
    text = text.lower().strip()
    # Ukrainian/Russian transliteration basic
    tr = {
        'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ie','ж':'zh','з':'z',
        'и':'y','і':'i','ї':'i','й':'i','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
        'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch',
        'ь':'','ю':'iu','я':'ia','ъ':'','ы':'y','э':'e',' ':'-'
    }
    out = ''.join(tr.get(c, c) for c in text)
    out = re.sub(r'[^a-z0-9\-]+', '-', out)
    out = re.sub(r'-+', '-', out).strip('-')
    return out or str(uuid.uuid4())[:8]


def serialize_doc(doc: dict) -> dict:
    if not doc:
        return doc
    for key, value in list(doc.items()):
        if isinstance(value, datetime):
            doc[key] = value.isoformat()
    return doc


# ============================================================
# Public endpoints
# ============================================================

@api_router.get("/")
async def root():
    return {"message": "Pnevmo Catalog API", "version": "1.0"}


@api_router.get("/products")
async def list_products(
    category: Optional[str] = None,
    status: Optional[str] = None,
    featured: Optional[bool] = None,
):
    query = {"isPublished": True}
    if category and category != 'all':
        query["category"] = category
    if status and status != 'all':
        query["status"] = status
    if featured is not None:
        query["featured"] = featured
    products = await db.products.find(query, {"_id": 0}).sort([("sortOrder", 1), ("createdAt", -1)]).to_list(500)
    return [serialize_doc(p) for p in products]


@api_router.get("/products/{slug}")
async def get_product(slug: str):
    product = await db.products.find_one({"slug": slug, "isPublished": True}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Товар не знайдено")
    return serialize_doc(product)


@api_router.get("/categories")
async def list_categories():
    categories = await db.categories.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    # Augment with product counts
    for cat in categories:
        cat['productCount'] = await db.products.count_documents({"category": cat['slug'], "isPublished": True})
    return categories


@api_router.get("/categories/{slug}")
async def get_category(slug: str):
    category = await db.categories.find_one({"slug": slug}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Категорію не знайдено")
    category['productCount'] = await db.products.count_documents({"category": slug, "isPublished": True})
    return category


@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({"id": "site-settings"}, {"_id": 0})
    if not settings:
        default = SiteSettings().model_dump()
        await db.settings.insert_one(default)
        return default
    return settings


@api_router.get("/faq")
async def list_faq():
    items = await db.faq.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return items


@api_router.get("/gallery")
async def list_gallery():
    items = await db.gallery.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return items


@api_router.post("/leads")
async def create_lead(lead_data: LeadCreate, request: Request):
    lead = Lead(**lead_data.model_dump())
    doc = lead.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    await db.leads.insert_one(doc)

    # ------------------------------------------------------------------
    # Forward lead to operator's email via FormSubmit.co (zero-key relay).
    # FormSubmit requires NO API key / NO signup — first POST triggers a
    # one-time email confirmation; after that link is clicked, every
    # subsequent POST forwards directly to the configured email address.
    #
    # All outgoing notifications are branded with the PUBLIC_SITE_URL env
    # var (the production customer-facing domain — e.g. https://pnevmo.shop).
    # We intentionally do NOT fall back to the request's Origin / Referer
    # headers, because in dev the request originates from the Emergent
    # preview URL — which must never leak into customer-facing emails.
    #
    # If the request fails (network down, FormSubmit unavailable, email
    # not yet confirmed, ...) we silently ignore it — the lead is already
    # persisted in MongoDB and admin can still see it at /admin/leads.
    # ------------------------------------------------------------------
    try:
        settings_doc = await db.settings.find_one({"id": "site-settings"}, {"_id": 0})
        email = (settings_doc or {}).get("email") or ""
        # Canonical site URL — always taken from env, never derived from
        # the inbound request. Default to the production domain so that
        # forgotten env vars still produce a correct, non-preview value.
        site_url = (os.environ.get("PUBLIC_SITE_URL") or "https://pnevmo.shop").rstrip("/")
        if email:
            product_line = ""
            if lead.product_title:
                product_line = f"\n🛒 Товар: {lead.product_title}"
            body = (
                f"🔔 Нова заявка з сайту ПНЕВМО\n"
                f"🌐 Сайт: {site_url}\n\n"
                f"🚐 Авто: {lead.name}\n"
                f"📞 Контакт: {lead.phone}\n"
                f"🎯 Задача: {lead.message or '—'}"
                f"{product_line}"
            )
            payload = {
                "name": lead.name[:120],
                "phone": lead.phone[:60],
                "message": lead.message or "",
                "product": lead.product_title or "",
                "_subject": "Нова заявка з сайту ПНЕВМО",
                "_template": "table",
                "_captcha": "false",
                "_replyto": email,
                "site": site_url,
                "summary": body,
            }
            # FormSubmit gatekeeps requests via Origin/Referer headers.
            # ALWAYS use the canonical production domain — never the
            # inbound request's Origin (which is the preview URL in dev).
            relay_headers = {
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (compatible; PnevmoLanding/1.0)",
                "Origin": site_url,
                "Referer": f"{site_url}/",
            }
            async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:
                resp = await client.post(
                    f"https://formsubmit.co/ajax/{email}",
                    data=payload,
                    headers=relay_headers,
                )
                logger.info(
                    "FormSubmit relay origin=%s status=%s body=%s",
                    site_url,
                    resp.status_code,
                    (resp.text or "")[:200],
                )
    except Exception as exc:  # noqa: BLE001
        # Never let a relay failure break the form submission for the user
        logger.warning("FormSubmit relay skipped: %s", exc)

    return {"success": True, "id": lead.id}


# ============================================================
# Admin endpoints
# ============================================================

@api_router.post("/admin/login", response_model=AdminToken)
async def admin_login(credentials: AdminLogin):
    admin = await db.admins.find_one({"email": credentials.email.lower().strip()}, {"_id": 0})
    if not admin or not verify_password(credentials.password, admin['password_hash']):
        raise HTTPException(status_code=401, detail="Невірний email або пароль")
    token = create_access_token({"sub": admin['email']})
    return AdminToken(access_token=token, admin_email=admin['email'])


@api_router.get("/admin/me")
async def admin_me(admin = Depends(get_current_admin)):
    return {"email": admin['email']}


@api_router.get("/admin/products")
async def admin_list_products(admin = Depends(get_current_admin)):
    products = await db.products.find({}, {"_id": 0}).sort([("sortOrder", 1), ("createdAt", -1)]).to_list(1000)
    return [serialize_doc(p) for p in products]


@api_router.get("/admin/products/{product_id}")
async def admin_get_product(product_id: str, admin = Depends(get_current_admin)):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Товар не знайдено")
    return serialize_doc(product)


@api_router.post("/admin/products")
async def admin_create_product(data: ProductCreate, admin = Depends(get_current_admin)):
    payload = data.model_dump()
    if not payload.get('slug'):
        payload['slug'] = slugify(payload['title'])
    # ensure slug unique
    existing = await db.products.find_one({"slug": payload['slug']})
    if existing:
        payload['slug'] = f"{payload['slug']}-{str(uuid.uuid4())[:6]}"
    product = Product(**payload)
    doc = product.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    doc['updatedAt'] = doc['updatedAt'].isoformat()
    await db.products.insert_one(doc)
    doc.pop('_id', None)
    return serialize_doc(doc)


@api_router.put("/admin/products/{product_id}")
async def admin_update_product(product_id: str, data: ProductUpdate, admin = Depends(get_current_admin)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Порожні дані для оновлення")
    update_data['updatedAt'] = datetime.now(timezone.utc).isoformat()
    # If slug changed, ensure uniqueness
    if 'slug' in update_data:
        existing = await db.products.find_one({"slug": update_data['slug'], "id": {"$ne": product_id}})
        if existing:
            update_data['slug'] = f"{update_data['slug']}-{str(uuid.uuid4())[:6]}"
    result = await db.products.update_one({"id": product_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Товар не знайдено")
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    return serialize_doc(product)


@api_router.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, admin = Depends(get_current_admin)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Товар не знайдено")
    return {"success": True}


@api_router.post("/admin/upload")
async def admin_upload_image(file: UploadFile = File(...), admin = Depends(get_current_admin)):
    # Read file, validate type
    allowed = {'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'}
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Непідтримуваний формат зображення")
    data = await file.read()
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Файл більше 5MB")
    encoded = base64.b64encode(data).decode('utf-8')
    data_url = f"data:{file.content_type};base64,{encoded}"
    return ImageUploadResponse(url=data_url)


@api_router.get("/admin/settings")
async def admin_get_settings(admin = Depends(get_current_admin)):
    settings = await db.settings.find_one({"id": "site-settings"}, {"_id": 0})
    if not settings:
        default = SiteSettings().model_dump()
        await db.settings.insert_one(default)
        return default
    return settings


@api_router.put("/admin/settings")
async def admin_update_settings(data: SiteSettingsUpdate, admin = Depends(get_current_admin)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if update_data:
        await db.settings.update_one({"id": "site-settings"}, {"$set": update_data}, upsert=True)
    settings = await db.settings.find_one({"id": "site-settings"}, {"_id": 0})
    return settings


@api_router.get("/admin/leads")
async def admin_list_leads(admin = Depends(get_current_admin)):
    leads = await db.leads.find({}, {"_id": 0}).sort("createdAt", -1).to_list(1000)
    return [serialize_doc(l) for l in leads]


@api_router.delete("/admin/leads/{lead_id}")
async def admin_delete_lead(lead_id: str, admin = Depends(get_current_admin)):
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Заявку не знайдено")
    return {"success": True}


@api_router.post("/admin/leads/{lead_id}/read")
async def admin_mark_lead_read(lead_id: str, admin = Depends(get_current_admin)):
    await db.leads.update_one({"id": lead_id}, {"$set": {"isRead": True}})
    return {"success": True}


@api_router.get("/admin/dashboard-stats")
async def admin_dashboard_stats(admin = Depends(get_current_admin)):
    total_products = await db.products.count_documents({})
    published = await db.products.count_documents({"isPublished": True})
    in_stock = await db.products.count_documents({"status": "in_stock", "isPublished": True})
    featured = await db.products.count_documents({"featured": True, "isPublished": True})
    total_leads = await db.leads.count_documents({})
    new_leads = await db.leads.count_documents({"isRead": False})
    total_categories = await db.categories.count_documents({})
    recent = await db.products.find({}, {"_id": 0}).sort("updatedAt", -1).to_list(5)
    return {
        "totalProducts": total_products,
        "publishedProducts": published,
        "inStockProducts": in_stock,
        "featuredProducts": featured,
        "totalLeads": total_leads,
        "newLeads": new_leads,
        "totalCategories": total_categories,
        "recentProducts": [serialize_doc(p) for p in recent],
    }


# ============================================================
# Seed on startup
# ============================================================

from seed import run_seed  # noqa: E402


@app.on_event("startup")
async def startup_event():
    await run_seed(db)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# Include the router in the main app
app.include_router(api_router)

# Mount static photos (real customer photos) under /api/photos/*
STATIC_DIR = ROOT_DIR / "static"
(STATIC_DIR / "photos").mkdir(parents=True, exist_ok=True)
app.mount("/api/photos", StaticFiles(directory=str(STATIC_DIR / "photos")), name="photos")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
