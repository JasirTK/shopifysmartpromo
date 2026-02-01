from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import ChatLog
from app.schemas import ChatMessage, ChatResponse

router = APIRouter()

# 1. The Knowledge Base (Answers)
TOPICS = {
    "pricing": "We offer three tiers:\n\n* **Starter ($29/mo)**: For new stores.\n* **Growth ($79/mo)**: Our most popular plan for scaling brands.\n* **Scale ($299/mo)**: Enterprise power for Shopify Plus.\n\nAll plans include a 14-day free trial!",
    
    "seo": "**Shopify SEO Best Practices:**\n\n1. **Keywords**: Use relevant terms in product titles and descriptions.\n2. **Alt Text**: Always describe your images for accessibility and search.\n3. **Site Structure**: Use collections to organize products logically.\n4. **Speed**: Our app ensures your store remains lightning fast ⚡.\n5. **Blog**: Publish content to drive organic traffic.",
    
    "speed": "Site speed is crucial! 🏎️\n\n* **Optimize Images**: Compress images before uploading.\n* **Limit Apps**: Only keep essential apps installed.\n* **Smart Promo**: We use 'Theme App Extensions' which load strictly after your main content, ensuring **zero** impact on your Core Web Vitals.",
    
    "install": "Installation is 1-click:\n\n1. Visit the Shopify App Store.\n2. Click 'Add App'.\n3. You'll be redirected here.\n4. Enable the 'App Embed' in your Theme Editor.",
    
    "customers": "We automatically sync with your Shopify Customer segments.\n\nTarget users by:\n* **VIP**: High LTV customers.\n* **At Risk**: Haven't ordered in 60 days.\n* **Local**: Customers in specific regions.\n* **Whales**: High average order value (AOV).",
    
    "support": "We're here 24/7!\n\n* 📧 Email: **support@smartpromo.io**\n* 💬 Chat: Right here!\n* 📚 Docs: Visit help.smartpromo.io",
    
    "shopify": "Shopify is the #1 commerce platform globally.\n\nIt handles:\n* **Hosting**: Secure and infinite scaling.\n* **Payments**: Integrated processing via Shopify Payments.\n* **Checkout**: The world's highest converting checkout.\n* **Channels**: Sell on Web, IG, TikTok, and Google at once.",

    "marketing": "To grow your store & **Increase Sales**:\n\n1. **Email Marketing**: Use Shopify Email or Klaviyo to retarget abandoned carts.\n2. **Social Ads**: Run Meta/TikTok ads targeting lookalikes of your best customers.\n3. **Content**: Post Reels/TikToks showing product usage.\n4. **Smart Promo**: Use our app to create urgent offers (e.g. \"Flash Sale\") that convert visitors into buyers!",

    "dropshipping": "**Dropshipping** lets you sell without holding inventory.\n\n1. Find suppliers (AliExpress, CJ, DSers).\n2. Import products to Shopify.\n3. When a customer buys, the supplier ships directly to them.\n\n*Tip: Focus on branding and fast shipping times to succeed.*",

    "payments": "Shopify Payments is the easiest way to accept money.\n\n* **Fees**: No transaction fees (unlike 3rd party gateways).\n* **Methods**: Visa, MC, Amex, Apple Pay, Google Pay.\n* **Payouts**: Fast deposits to your bank account.",

    "shipping": "Shipping strategies:\n\n* **Free Shipping**: Increases conversion (absorb cost in product price).\n* **Flat Rate**: Simple for customers to understand.\n* **Real-time**: Charge exact carrier rates (UPS/FedEx).\n\n*Tip: Use Shopify Shipping to buy labels at a discount!*",

    "inventory": "Manage stock efficiently:\n\n* **Track Quantity**: Enable this for all products.\n* **Transfers**: Log incoming stock from suppliers.\n* **ABC Analysis**: Focus on your top-selling 20% of products.",

    "apps": "Essential Shopify Apps stack:\n\n1. **Smart Promo** (Sales & Offers)\n2. **Klaviyo** (Email/SMS)\n3. **Loox/Yotpo** (Reviews)\n4. **PageFly** (Landing Pages)",
    
    "theme": "Your theme is your storefront.\n\n* **Dawn**: The standard, fast free theme.\n* **Premium**: Impulse, Prestige, or customized themes.\n* **Customization**: Use the Online Store > Editor to change colors, fonts, and layout without code.",

    "domains": "A custom domain builds trust!\n\n1. Go to **Settings > Domains**.\n2. Buy a new domain (e.g. `mystore.com`) or connect an existing one.\n3. It usually costs ~$14/year.",

    "analytics": "Use Shopify Analytics to understand your business:\n\n* **Total Sales**: Your gross revenue.\n* **Conversion Rate**: Goal is >2%.\n* **AOV**: Average Order Value (Try to increase this with upsells).",

    "refunds": "Handling returns is part of business.\n\n1. Go to **Orders**.\n2. Select the order and click **Return** or **Refund**.\n3. You can restock items automatically.\n\n*Tip: Have a clear Refund Policy on your store!*"
}

# 2. Synonym Mapping (Keywords -> Topic Key)
KEYWORD_MAP = {
    # Pricing
    "price": "pricing", "cost": "pricing", "pay": "pricing", "subscription": "pricing", "plan": "pricing", "expensive": "pricing", "cheap": "pricing", "money": "pricing", "bill": "pricing",
    
    # SEO
    "seo": "seo", "search": "seo", "google": "seo", "rank": "seo", "traffic": "seo", "keywords": "seo",
    
    # Speed
    "speed": "speed", "fast": "speed", "slow": "speed", "performance": "speed", "load": "speed", "optimization": "speed",
    
    # Install
    "install": "install", "setup": "install", "start": "install", "configure": "install", "guide": "install",
    
    # Customers
    "customer": "customers", "user": "customers", "client": "customers", "segment": "customers", "audience": "customers",
    
    # Support
    "support": "support", "help": "support", "contact": "support", "email": "support", "bug": "support", "issue": "support", "error": "support",
    
    # Shopify
    "shopify": "shopify", "platform": "shopify", "ecommerce": "shopify",
    
    # Marketing & Sales (CRITICAL FIX: Added 'sales' keywords)
    "marketing": "marketing", "market": "marketing", "ad": "marketing", "ads": "marketing", "promote": "marketing", "promotion": "marketing", "social": "marketing", "instagram": "marketing", "tiktok": "marketing", "facebook": "marketing", "sales": "marketing", "sale": "marketing", "revenue": "marketing", "grow": "marketing", "growth": "marketing", "selling": "marketing",
    
    # Dropshipping
    "dropshipping": "dropshipping", "dropship": "dropshipping", "supplier": "dropshipping", "aliexpress": "dropshipping", "sourcing": "dropshipping",
    
    # Payments
    "payment": "payments", "payments": "payments", "gateway": "payments", "visa": "payments", "mastercard": "payments", "paypal": "payments", "stripe": "payments",
    
    # Shipping
    "shipping": "shipping", "ship": "shipping", "delivery": "shipping", "deliver": "shipping", "fulfillment": "shipping", "courier": "shipping", "labels": "shipping",
    
    # Inventory
    "inventory": "inventory", "stock": "inventory", "product": "inventory", "warehouse": "inventory", "sku": "inventory",
    
    # Apps
    "app": "apps", "apps": "apps", "plugin": "apps", "extension": "apps", "tool": "apps",
    
    # Theme
    "theme": "theme", "themes": "theme", "design": "theme", "template": "theme", "look": "theme", "liquid": "theme", "editor": "theme",

    # Details
    "domain": "domains", "url": "domains", "website": "domains",
    "analytic": "analytics", "report": "analytics", "data": "analytics", "conversion": "analytics",
    "refund": "refunds", "return": "refunds", "cancel": "refunds"
}

@router.post("/message", response_model=ChatResponse)
async def chat_message(chat_msg: ChatMessage, db: AsyncSession = Depends(get_db)):
    user_msg = chat_msg.message.lower()
    
    response_text = ""
    
    # 1. Smart Keyword Matching
    matched_topic = None
    
    # Scan for keywords
    for keyword, topic in KEYWORD_MAP.items():
        if keyword in user_msg:
            # We found a keyword!
            matched_topic = topic
            break # Return the first valid match
            
    # 2. Generate Response
    if matched_topic and matched_topic in TOPICS:
        response_text = TOPICS[matched_topic]
    else:
        # Fallback / Conversational Logic
        if "hello" in user_msg or "hi" in user_msg or "hey" in user_msg:
            response_text = "Hello! 👋\n\nI am your **Shopify Knowledge Expert**.\n\nAsk me about:\n* Marketing & Sales\n* SEO & Speed\n* Shipping & Payments\n* Our App Features"
        elif "thank" in user_msg:
            response_text = "You're welcome! Let me know if you need anything else to grow your business. 🚀"
        elif "bye" in user_msg:
             response_text = "Goodbye! Good luck with your sales! 💸"
        else:
            response_text = "That's a great question. 🤔\n\nI'm constantly learning. While I don't have a specific answer for that yet, I'd recommend checking the **Shopify Help Center** or asking about **marketing**, **sales**, or **setup**."
            
    # Save to DB
    log = ChatLog(
        session_id=chat_msg.session_id,
        user_message=chat_msg.message,
        bot_response=response_text
    )
    db.add(log)
    await db.commit()
    
    return ChatResponse(response=response_text)
