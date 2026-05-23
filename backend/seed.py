"""Seed script: default admin, categories, products, FAQ, settings.

Uses REAL customer photos served from /api/photos/* — classified by content:
- AIR_SPRING_CLOSEUP: standalone product shots of pneumatic bags
- AIR_SPRING_INSTALLED: bags mounted on vehicle suspension
- KIT_LAID_OUT: full kits (bags + compressor + hoses + fittings)
- COMPONENT: compressor, manometer, fittings
- VEHICLE_EXTERIOR: vans / trucks / Hummer
- INSTALL_PROCESS: workshop / installation scenes
- DIAGRAM: spec diagram
"""
import bcrypt
import uuid
from datetime import datetime, timezone


def _hash(pw: str) -> str:
    return bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


DEFAULT_ADMIN_EMAIL = "admin@pnevmo.ua"
DEFAULT_ADMIN_PASSWORD = "admin123"


# ============================================================
# REAL PHOTO REGISTRY — served via /api/photos/<file>
# ============================================================
# Classified after visual analysis of /tmp/arch2 (34 files, IMG_7326–IMG_7360)

def P(name: str) -> str:
    """Return relative API path to photo (frontend joins with REACT_APP_BACKEND_URL)."""
    return f"/api/photos/{name}"


# Close-up / studio shots of air springs (hero-ready, product cards)
CLOSEUP = [
    P("IMG_7339.JPG"),
    P("IMG_7340.JPG"),
    P("IMG_7342.JPG"),
    P("IMG_7347.JPG"),
    P("IMG_7348.JPG"),
    P("IMG_7349.JPG"),
]

# Air springs already installed on vehicles (undercarriage / suspension shots)
INSTALLED = [
    P("IMG_7327.JPG"),
    P("IMG_7328.JPG"),
    P("IMG_7329.JPG"),
    P("IMG_7332.JPG"),
    P("IMG_7333.JPG"),
    P("IMG_7338.JPG"),
    P("IMG_7344.JPG"),
    P("IMG_7351.JPG"),
    P("IMG_7352.JPG"),
    P("IMG_7353.JPG"),
    P("IMG_7354.JPG"),
    P("IMG_7356.JPG"),
    P("IMG_7357.JPG"),
    P("IMG_7358.JPG"),
    P("IMG_7359.JPG"),
    P("IMG_7360.JPG"),
]

# Full kits laid out (bags + compressor + hoses + fittings)
KITS = [
    P("IMG_7334.JPG"),
    P("IMG_7335.JPG"),
    P("IMG_7341.JPG"),
]

# Components (compressor, manometer, fittings, brackets)
COMPONENTS = [
    P("IMG_7326.JPG"),
    P("IMG_7331.JPG"),
]

# Vehicle exteriors (Sprinter-type van, yellow van, Hummer etc.)
VEHICLES = [
    P("IMG_7330.JPG"),  # white van
    P("IMG_7350.JPG"),  # yellow van
    P("IMG_7355.JPG"),  # Hummer / SUV
]

# Installation / workshop scenes
INSTALL = [
    P("IMG_7337.JPG"),
    P("IMG_7343.JPG"),
    P("IMG_7345.JPG"),
]

# Spec diagram / technical drawing
DIAGRAM = [
    P("IMG_7346.JPG"),
]


CATEGORIES = [
    {
        "slug": "air-springs",
        "title": "Пневмоподушки",
        "shortDescription": "Посилені пневмоподушки для задньої восі — від легкових до вантажних авто",
        "image": CLOSEUP[0],
        "icon": "Disc3",
        "order": 1,
    },
    {
        "slug": "air-suspension",
        "title": "Комплекти пневмопідвіски",
        "shortDescription": "Повні комплекти під Sprinter, Crafter, Transit та вантажні авто",
        "image": KITS[0],
        "icon": "Layers",
        "order": 2,
    },
    {
        "slug": "components",
        "title": "Комплектуючі",
        "shortDescription": "Компресори, фітинги, магістралі, клапани, манометри та пульти",
        "image": COMPONENTS[0],
        "icon": "Wrench",
        "order": 3,
    },
    {
        "slug": "custom-solutions",
        "title": "Індивідуальні рішення",
        "shortDescription": "Виготовлення комплектів під специфічні авто та задачі",
        "image": INSTALL[2],
        "icon": "Sparkles",
        "order": 4,
    },
    {
        "slug": "by-vehicle",
        "title": "Рішення за авто",
        "shortDescription": "Sprinter, Crafter, Transit, вантажні, причепи — готові підбори",
        "image": VEHICLES[0],
        "icon": "Truck",
        "order": 5,
    },
]


# Product = hero image (primary) + curated gallery (closeup + installed + context)
PRODUCTS = [
    {
        "title": "Пневмоподушки посилені Mercedes Sprinter",
        "slug": "air-springs-sprinter",
        "category": "air-springs",
        "shortDescription": "Підсилення задньої восі Sprinter — стабільність під навантаженням до 1500 кг",
        "fullDescription": "Посилені пневмоподушки власного виробництва для Mercedes Sprinter. Встановлюються у задні пружини, усувають просідання під навантаженням, покращують керованість. Ресурс — понад 200 000 км. Гарантія 12 місяців.",
        "image": CLOSEUP[0],
        "gallery": [CLOSEUP[0], INSTALLED[0], INSTALLED[1], VEHICLES[0], CLOSEUP[3]],
        "status": "in_stock",
        "badge": "Власне виробництво",
        "vehicleTypes": ["Sprinter", "Мікроавтобуси"],
        "featured": True,
        "sortOrder": 1,
    },
    {
        "title": "Комплект пневмопідвіски VW Crafter",
        "slug": "air-suspension-kit-crafter",
        "category": "air-suspension",
        "shortDescription": "Повний комплект для VW Crafter з пультом керування з салону",
        "fullDescription": "Повний комплект пневмопідвіски для VW Crafter: дві пневмоподушки, компресор 12В з ресивером, електропневматичний блок керування, пульт у салон, магістралі, фітинги, манометр. Виготовлення 5–10 днів.",
        "image": KITS[0],
        "gallery": [KITS[0], KITS[1], INSTALLED[2], INSTALL[0], COMPONENTS[0]],
        "status": "on_order",
        "badge": "Під авто",
        "vehicleTypes": ["Crafter", "Мікроавтобуси"],
        "featured": True,
        "sortOrder": 2,
    },
    {
        "title": "Пневмоподушки для Ford Transit",
        "slug": "air-springs-transit",
        "category": "air-springs",
        "shortDescription": "Балонні пневмоподушки всередину пружини — регулювання жорсткості",
        "fullDescription": "Комплект пневмоподушок балонного типу для всіх генерацій Ford Transit. Встановлюються всередину пружини, дозволяють регулювати висоту авто та жорсткість. Монтаж — без зварювання.",
        "image": CLOSEUP[1],
        "gallery": [CLOSEUP[1], INSTALLED[3], INSTALLED[4], VEHICLES[1], CLOSEUP[4]],
        "status": "in_stock",
        "badge": "ТОП",
        "vehicleTypes": ["Transit", "Мікроавтобуси"],
        "featured": True,
        "sortOrder": 3,
    },
    {
        "title": "Комплект пневмопідвіски для вантажного авто",
        "slug": "air-suspension-kit-truck",
        "category": "air-suspension",
        "shortDescription": "Повна система для вантажних авто до 7.5 т — підбір під задачу",
        "fullDescription": "Комплект пневмопідвіски для вантажних авто масою до 7.5 т: дві посилені подушки (до 3000 кг кожна), потужний компресор, електроблок, балансувальний клапан. Індивідуальний підбір.",
        "image": KITS[1],
        "gallery": [KITS[1], KITS[2], INSTALLED[5], INSTALLED[6], COMPONENTS[1]],
        "status": "on_order",
        "badge": "Індивідуально",
        "vehicleTypes": ["Вантажні авто", "Спецтехніка"],
        "featured": True,
        "sortOrder": 4,
    },
    {
        "title": "Комплект пневмопідвіски для причепа",
        "slug": "air-suspension-kit-trailer",
        "category": "air-suspension",
        "shortDescription": "Рішення для причепів до 3.5 т — рівна площадка під будь-яким вантажем",
        "fullDescription": "Комплект пневмопідвіски для легкових та вантажних причепів до 3.5 т. Пара пневмоподушок, компресор 12В, магістралі, дистанційний пульт.",
        "image": KITS[2],
        "gallery": [KITS[2], INSTALLED[7], INSTALLED[8], INSTALL[1], COMPONENTS[0]],
        "status": "on_order",
        "badge": None,
        "vehicleTypes": ["Причепи"],
        "featured": True,
        "sortOrder": 5,
    },
    {
        "title": "Компресор 12В з ресивером 3 л",
        "slug": "compressor-12v-3l",
        "category": "components",
        "shortDescription": "Потужний компресор для автономної пневмосистеми — нагнітання 30 с",
        "fullDescription": "Автомобільний компресор 12В з металевим ресивером 3 л. Продуктивність 50 л/хв, тиск до 10 бар. Захист від перегріву, реле тиску в комплекті. Робоче серце будь-якої пневмопідвіски.",
        "image": COMPONENTS[0],
        "gallery": [COMPONENTS[0], COMPONENTS[1], KITS[0], KITS[1]],
        "status": "in_stock",
        "badge": None,
        "vehicleTypes": ["Всі типи"],
        "featured": True,
        "sortOrder": 6,
    },
    {
        "title": "Комплект фітингів та магістралей",
        "slug": "fittings-lines-kit",
        "category": "components",
        "shortDescription": "Повний набір для монтажу пневмосистеми з нуля",
        "fullDescription": "Повний комплект магістралей та фітингів для пневмосистеми: шланги різної довжини, швидкороз'ємні з'єднання, трійники, кутники, манометр, клапан безпеки.",
        "image": COMPONENTS[1],
        "gallery": [COMPONENTS[1], KITS[0], COMPONENTS[0]],
        "status": "in_stock",
        "badge": None,
        "vehicleTypes": ["Всі типи"],
        "featured": False,
        "sortOrder": 7,
    },
    {
        "title": "Подвійний манометр з підсвіткою",
        "slug": "dual-manometer",
        "category": "components",
        "shortDescription": "Точний контроль тиску обох контурів з салону авто",
        "fullDescription": "Електронний подвійний манометр для контролю тиску лівого та правого контурів пневмопідвіски. Діапазон 0–12 бар, підсвітка, монтаж у панель приладів.",
        "image": COMPONENTS[0],
        "gallery": [COMPONENTS[0], KITS[2]],
        "status": "in_stock",
        "badge": None,
        "vehicleTypes": ["Всі типи"],
        "featured": False,
        "sortOrder": 8,
    },
    {
        "title": "Індивідуальне пневморішення під спецтехніку",
        "slug": "custom-solution-special",
        "category": "custom-solutions",
        "shortDescription": "Інженерний розрахунок та виготовлення під конкретну задачу",
        "fullDescription": "Індивідуальний підбір та виготовлення комплекту пневмопідвіски під спецтехніку, комерційний транспорт та унікальні проєкти. Розрахунок, CAD-креслення, виробництво, тест-драйв. Гарантія 24 місяці.",
        "image": VEHICLES[2],
        "gallery": [VEHICLES[2], DIAGRAM[0], INSTALLED[11], INSTALL[2], CLOSEUP[5]],
        "status": "on_order",
        "badge": "Індивідуально",
        "vehicleTypes": ["Спецтехніка", "Промисловість"],
        "featured": False,
        "sortOrder": 9,
    },
    {
        "title": "Пневмоподушки для легкового авто",
        "slug": "air-springs-passenger",
        "category": "air-springs",
        "shortDescription": "Компактні подушки всередину пружини — швидка установка без зварювання",
        "fullDescription": "Пневмоподушки балонного типу для установки всередину пружини задньої підвіски легкового авто. Дозволяють регулювати жорсткість та висоту. Легка установка.",
        "image": CLOSEUP[2],
        "gallery": [CLOSEUP[2], INSTALLED[12], INSTALLED[13], CLOSEUP[5]],
        "status": "in_stock",
        "badge": None,
        "vehicleTypes": ["Легкові авто"],
        "featured": False,
        "sortOrder": 10,
    },
    {
        "title": "Електропневматичний блок керування",
        "slug": "control-valve-block",
        "category": "components",
        "shortDescription": "Блок для автоматичного керування тиском у контурах",
        "fullDescription": "Електропневматичний блок для керування двоконтурною пневмопідвіскою. 4 електроклапани, програмована електроніка, захист від перепадів тиску. Підключається до пульту або смартфону.",
        "image": COMPONENTS[1],
        "gallery": [COMPONENTS[1], KITS[1], COMPONENTS[0]],
        "status": "in_stock",
        "badge": "Новинка",
        "vehicleTypes": ["Всі типи"],
        "featured": False,
        "sortOrder": 12,
    },
    {
        "title": "Комплект для кемпера / RV",
        "slug": "air-suspension-rv",
        "category": "by-vehicle",
        "shortDescription": "Рішення для кемперів та переобладнаних вантажівок під житло",
        "fullDescription": "Спеціальний комплект пневмопідвіски для кемперів, автодомів та переобладнаних фургонів. Підсилення під постійне навантаження + максимальний комфорт та рівна площадка.",
        "image": VEHICLES[1],
        "gallery": [VEHICLES[1], INSTALLED[14], INSTALLED[15], KITS[0]],
        "status": "on_order",
        "badge": None,
        "vehicleTypes": ["Мікроавтобуси", "Camper"],
        "featured": False,
        "sortOrder": 13,
    },
]


FAQ_ITEMS = [
    {
        "question": "Чи ви виробник чи перепродавець?",
        "answer": "Ми виробник пневмоподушок з власним цехом у Києві. 20 років виготовляємо пневмоподушки самостійно — від вулканізації гуми до фінального тестування. Працюємо з оптом, дилерами, СТО, OEM-замовниками, а також відпускаємо роздріб напряму з виробництва.",
        "order": 1,
    },
    {
        "question": "Які умови для оптових покупців?",
        "answer": "Окремий оптовий прайс від першої партії. Стандартні типорозміри — зі складу, виготовлення під замовлення — 5–10 робочих днів. Накопичувальні знижки для постійних оптових клієнтів. Технічна підтримка від виробника. Напишіть тип запиту в Telegram — надішлемо прайс і умови.",
        "order": 2,
    },
    {
        "question": "Чи виготовляєте OEM-партії під торгову марку замовника?",
        "answer": "Так. Працюємо за технічним завданням замовника: типорозмір, конфігурація, маркування. Партії від 50 шт. Договір, специфікація, протоколи якості. Постачаємо в Україну та на експорт.",
        "order": 3,
    },
    {
        "question": "Що отримує роздрібний клієнт від виробника?",
        "answer": "Пряма ціна без посередницьких націнок — товар напряму з виробництва. Це лише виріб (пневмоподушки), без додаткових послуг типу встановлення чи ремкомплектів — просто продукт з нашого цеху. Гарантія від виробника, відправка Новою Поштою по Україні.",
        "order": 4,
    },
    {
        "question": "Яка гарантія від виробника?",
        "answer": "На серійні пневмоподушки — 12 місяців. На OEM-партії та індивідуальні рішення — 24 місяці. Усі гарантійні випадки — обмін або ремонт за рахунок виробника.",
        "order": 5,
    },
    {
        "question": "Чи є типорозміри в наявності?",
        "answer": "Стандартна лінійка (Sprinter, Crafter, Transit, вантажні до 7.5 т, причепи, балонні в пружину) — на складі. Нестандартні розміри та OEM — виготовлення 5–14 днів за специфікацією.",
        "order": 6,
    },
    {
        "question": "Як працює відвантаження?",
        "answer": "Опт — у день оплати або наступного дня (залежно від обсягу). Роздріб — у день оплати Новою Поштою. Вантажні партії — наш транспорт або транспортна компанія за домовленістю. Експорт — FCA/EXW Inco­terms.",
        "order": 7,
    },
    {
        "question": "Чи можна замовити сировину/комплектуючі окремо?",
        "answer": "Ні, ми постачаємо тільки готовий виріб — пневмоподушки власного виробництва. Ремкомплекти, фітинги, компресори тощо — окремими позиціями каталогу, без розукомплектації наших виробів.",
        "order": 8,
    },
]


# Public gallery shown on landing — a curated masonry mix with captions
PUBLIC_GALLERY = [
    {"image": INSTALLED[0],  "caption": "Пневмоподушки на Sprinter",      "tag": "Sprinter"},
    {"image": CLOSEUP[0],    "caption": "Пневмоподушка крупним планом",    "tag": "Виробництво"},
    {"image": INSTALLED[4],  "caption": "Комплект у задній восі",          "tag": "На авто"},
    {"image": KITS[0],       "caption": "Повний комплект під авто",         "tag": "Комплект"},
    {"image": INSTALLED[7],  "caption": "Підсилення вантажної осі",         "tag": "Вантажні"},
    {"image": CLOSEUP[3],    "caption": "Партія готових виробів",           "tag": "Виробництво"},
    {"image": VEHICLES[0],   "caption": "Фургон у роботі",                  "tag": "Van"},
    {"image": INSTALL[0],    "caption": "Тестове складання у цеху",         "tag": "Виробництво"},
    {"image": INSTALLED[10], "caption": "Детально: шток і кронштейн",        "tag": "Деталі"},
    {"image": KITS[2],       "caption": "Комплект для причепа",              "tag": "Причіп"},
    {"image": VEHICLES[2],   "caption": "Індивідуальне рішення",              "tag": "Custom"},
    {"image": INSTALLED[13], "caption": "На місці — працює під тиском",      "tag": "Результат"},
]


async def run_seed(db):
    # Admin
    if await db.admins.count_documents({}) == 0:
        await db.admins.insert_one({
            "id": str(uuid.uuid4()),
            "email": DEFAULT_ADMIN_EMAIL,
            "password_hash": _hash(DEFAULT_ADMIN_PASSWORD),
            "createdAt": datetime.now(timezone.utc).isoformat(),
        })
        print(f"[seed] Admin created: {DEFAULT_ADMIN_EMAIL} / {DEFAULT_ADMIN_PASSWORD}")

    # Categories: replace whenever image source changes (force re-seed by checking first category image)
    need_cat_reseed = True
    existing_first = await db.categories.find_one({"slug": CATEGORIES[0]["slug"]}, {"_id": 0})
    if existing_first and existing_first.get("image") == CATEGORIES[0]["image"]:
        # Same image — assume fresh
        existing_slugs = {c.get("slug") async for c in db.categories.find({}, {"_id": 0, "slug": 1})}
        new_slugs = {c["slug"] for c in CATEGORIES}
        if existing_slugs == new_slugs:
            need_cat_reseed = False
    if need_cat_reseed:
        await db.categories.delete_many({})
        for cat in CATEGORIES:
            doc = dict(cat)
            doc['id'] = str(uuid.uuid4())
            await db.categories.insert_one(doc)
        print(f"[seed] Categories re-seeded: {len(CATEGORIES)}")

    # Products: re-seed if slug-set OR first product's image changed (migration from Unsplash → real photos)
    need_product_reseed = True
    existing_first_p = await db.products.find_one({"slug": PRODUCTS[0]["slug"]}, {"_id": 0})
    if existing_first_p and existing_first_p.get("image") == PRODUCTS[0]["image"]:
        existing_slugs = {p.get("slug") async for p in db.products.find({}, {"_id": 0, "slug": 1})}
        new_slugs = {p["slug"] for p in PRODUCTS}
        if existing_slugs == new_slugs:
            need_product_reseed = False
    if need_product_reseed:
        await db.products.delete_many({})
        now = datetime.now(timezone.utc).isoformat()
        for p in PRODUCTS:
            doc = dict(p)
            doc['id'] = str(uuid.uuid4())
            doc['isPublished'] = True
            doc.setdefault('gallery', [])
            doc.setdefault('vehicleTypes', [])
            doc.setdefault('badge', None)
            doc['createdAt'] = now
            doc['updatedAt'] = now
            await db.products.insert_one(doc)
        print(f"[seed] Products re-seeded: {len(PRODUCTS)}")

    # FAQ - re-seed if count differs OR first question changed OR 4th question
    # changed (content version check). The 4th item's question text is used
    # as a fingerprint for content revisions (Phase 6.4: завод → виробник).
    existing_faq = await db.faq.count_documents({})
    existing_faq_first = await db.faq.find_one({"order": 1}, {"_id": 0})
    existing_faq_fourth = await db.faq.find_one({"order": 4}, {"_id": 0})
    faq_changed = (
        existing_faq != len(FAQ_ITEMS)
        or not existing_faq_first
        or existing_faq_first.get("question") != FAQ_ITEMS[0]["question"]
        or not existing_faq_fourth
        or existing_faq_fourth.get("question") != FAQ_ITEMS[3]["question"]
    )
    if faq_changed:
        await db.faq.delete_many({})
        for q in FAQ_ITEMS:
            doc = dict(q)
            doc['id'] = str(uuid.uuid4())
            await db.faq.insert_one(doc)
        print(f"[seed] FAQ re-seeded: {len(FAQ_ITEMS)}")

    # Public gallery — new collection, re-seed when source changes
    need_gallery_reseed = True
    existing_first_g = await db.gallery.find_one({}, {"_id": 0})
    if existing_first_g and existing_first_g.get("image") == PUBLIC_GALLERY[0]["image"]:
        count = await db.gallery.count_documents({})
        if count == len(PUBLIC_GALLERY):
            need_gallery_reseed = False
    if need_gallery_reseed:
        await db.gallery.delete_many({})
        for i, g in enumerate(PUBLIC_GALLERY):
            doc = dict(g)
            doc['id'] = str(uuid.uuid4())
            doc['order'] = i
            await db.gallery.insert_one(doc)
        print(f"[seed] Gallery re-seeded: {len(PUBLIC_GALLERY)}")

    # Settings
    if await db.settings.count_documents({}) == 0:
        from server import SiteSettings
        await db.settings.insert_one(SiteSettings().model_dump())
        print("[seed] Settings: default")
    else:
        # Refresh tagline if it still has any of the OLD retail-positioning copy.
        # Once admin edits tagline via /admin/settings to anything else, we won't
        # touch it again.
        OLD_TAGLINES = [
            "Пневмоподушки та комплекти пневмопідвіски для комерційного транспорту",
            "Завод пневмоподушок · Україна · 20 років. Опт · Дилери · OEM · Роздріб з заводу",
        ]
        # One-time migration: rotate Telegram username away from previously
        # seeded handles to the operator's current support channel.
        OLD_TG_USERNAMES = ["teropevtsoznaniya", "pnevmo_pro", "pnevmo"]
        from server import SiteSettings
        new_tagline = SiteSettings().tagline
        new_tg = SiteSettings().telegram_username
        cur = await db.settings.find_one({"id": "site-settings"}, {"_id": 0})
        if cur and cur.get("tagline") in OLD_TAGLINES:
            await db.settings.update_one(
                {"id": "site-settings"}, {"$set": {"tagline": new_tagline}}
            )
            print("[seed] Settings tagline upgraded to manufacturer-positioning copy")
        if cur and (cur.get("telegram_username") or "").lstrip("@") in OLD_TG_USERNAMES:
            await db.settings.update_one(
                {"id": "site-settings"}, {"$set": {"telegram_username": new_tg}}
            )
            print(f"[seed] Settings telegram_username upgraded to @{new_tg}")
