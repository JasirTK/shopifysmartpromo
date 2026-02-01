import asyncio
from app.database import engine, Base, AsyncSessionLocal
from app.models import Section
from sqlalchemy.future import select

initial_data = {
    "hero": {
        "slides": [
            {
                "title": "The Native AI Growth Engine for Shopify",
                "subtitle": "Seamlessly integrates with your Shopify store to automate promotions and boost retention.",
                "cta_primary": "Install Shopify App",
                "cta_primary_url": "#",
                "cta_secondary": "View Demo Store",
                "cta_secondary_url": "#",
                "style": "gradient-indigo",
                "image_url": "" 
            },
            {
                "title": "Turn Shopify Visitors into Customers",
                "subtitle": "Smart popups that sync with your Shopify inventory and customer tags.",
                "cta_primary": "Start Free Trial",
                "cta_primary_url": "#",
                "cta_secondary": "Explore Features",
                "cta_secondary_url": "#",
                "style": "dark-mode",
                "image_url": "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1000"
            },
            {
                "title": "Deep Sync with Shopify Data",
                "subtitle": "Analyze 12 months of Shopify Order history to predict your next bestseller.",
                "cta_primary": "Connect Store",
                "cta_primary_url": "#",
                "cta_secondary": "Read Case Study",
                "cta_secondary_url": "#",
                "style": "light-mode",
                "image_url": ""
            }
        ]
    },
    "features": {
        "title": "Built Exclusively for Shopify Plus",
        "items": [
            {"title": "Shopify Flow Integration", "desc": "Trigger advanced automation directly from your Shopify Admin Flow.", "icon": "Zap"},
            {"title": "Sync Orders & Customers", "desc": "Real-time bi-directional sync with your Shopify customer database.", "icon": "Users"},
            {"title": "Smart Discount Codes", "desc": "Auto-generate unique Shopify discount codes based on user behavior.", "icon": "Tag"},
            {"title": "Theme App Extension", "desc": "Works with Online Store 2.0 themes without slowing down your site.", "icon": "Layout"},
            {"title": "POS Compatibility", "desc": "Capture emails in-store and sync them to your online marketing lists.", "icon": "Smartphone"},
            {"title": "Multi-Currency Support", "desc": "Native support for Shopify Markets and international currencies.", "icon": "Globe"}
        ]
    },
    "how_it_works": {
        "title": "Launch in 3 Simple Steps",
        "steps": [
            {"step": 1, "title": "Install from App Store", "desc": "Find 'Smart Promo' on the official Shopify App Store and click Install."},
            {"step": 2, "title": "One-Click OAuth", "desc": "Securely authorize access to your store via Shopify's official API."},
            {"step": 3, "title": "Watch Sales Grow", "desc": "We instantly analyze your past orders and deploy optimized campaigns."}
        ]
    },
    "testimonials": {
        "title": "Trusted by 5,000+ Shopify Merchants",
        "items": [
            {"name": "Sarah Jenkins", "role": "Owner, EcoWear", "quote": "The best Shopify app we've installed this year. ROI was positive in day 3.", "avatar": "https://i.pravatar.cc/150?u=a042581f4e29026024d"},
            {"name": "David Chen", "role": "CTO, TechGear", "quote": "Finally, an AI tool that actually respects Shopify's API rate limits. Rock solid.", "avatar": "https://i.pravatar.cc/150?u=a042581f4e29026704d"},
            {"name": "Elena Rodriguez", "role": "Marketing VP, GlowUp", "quote": "Syncs perfectly with our theme. No liquid code changes needed!", "avatar": "https://i.pravatar.cc/150?u=a042581f4e29026703d"}
        ]
    },
    "pricing": {
        "title": "Simple Plans for Every Stage",
        "subtitle": "Choose the perfect plan for your Shopify store size. Upgrade or downgrade anytime.",
        "plans": [
            {
                "name": "Starter",
                "price": "$29",
                "period": "mo",
                "description": "Perfect for essential sales automation and basic insights.",
                "features": ["Up to 500 Orders/mo", "Basic Cohort Analysis", "1 Automated Campaign", "Email Support"],
                "cta": "Start Free Trial",
                "cta_url": "#",
                "highlight": False
            },
            {
                "name": "Growth",
                "price": "$79",
                "period": "mo",
                "description": "Advanced tools for scaling brands with serious revenue goals.",
                "features": ["Up to 2,500 Orders/mo", "Predictive Analytics", "Unlimited Campaigns", "Chatbot Assistant", "Priority Support"],
                "cta": "Start Free Trial",
                "cta_url": "#",
                "highlight": True
            },
            {
                "name": "Scale",
                "price": "$299",
                "period": "mo",
                "description": "Enterprise-grade power for high-volume Shopify Plus merchants.",
                "features": ["Unlimited Orders", "Custom AI Models", "Dedicated Success Manager", "Shopify Flow Actions", "API Access"],
                "cta": "Contact Sales",
                "cta_url": "#",
                "highlight": False
            }
        ]
    },
    "cta_bottom": {
        "title": "Ready to scale your Shopify brand?",
        "subtitle": "Join the fastest growing merchants on the Shopify platform.",
        "cta_main": "Install on Shopify",
        "cta_main_url": "#",
        "cta_sub": "14-day free trial • Cancel anytime"
    },
    "seo": {
        "title": "Smart Promo - #1 AI App for Shopify",
        "description": "Boost sales with AI-powered promotions. The highest rated growth app on the Shopify App Store."
    },
    "shopify_integration": {
        "title": "Deeply Integrated with Shopify",
        "subtitle": "We don't just sit on top of your store. We are woven into the fabric of the Shopify ecosystem.",
        "features": [
            {
                "title": "Shopify Flow", 
                "desc": "Trigger Smart Promo campaigns directly from Shopify Flow workflows. No coding required.", 
                "icon": "Workflow"
            },
            {
                "title": "Checkout Extensibility", 
                "desc": "Native checkout upsells that look and feel exactly like your brand's checkout experience.", 
                "icon": "CreditCard"
            },
            {
                "title": "Hydrogen Ready", 
                "desc": "Headless storefront? No problem. Our React components are 100% compatible with Hydrogen.", 
                "icon": "Code"
            },
            {
                "title": "Shopify Markets", 
                "desc": "Automatically adjust currency and language for your international customers.", 
                "icon": "Globe"
            }
        ]
    }
}

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Seed Content
        for key, content in initial_data.items():
            result = await db.execute(select(Section).where(Section.key == key))
            existing = result.scalars().first()
            if not existing:
                print(f"Seeding {key}...")
                db.add(Section(key=key, content=content))
            else:
                print(f"Updating {key}...")
                existing.content = content
        
        # Seed Admin User
        from app.models import User
        from app.auth import get_password_hash
        
        result = await db.execute(select(User).where(User.username == "admin"))
        user = result.scalars().first()
        if not user:
            print("Creating admin user...")
            admin_user = User(
                username="admin", 
                hashed_password=get_password_hash("admin123")
            )
            db.add(admin_user)
        else:
            print("Admin user already exists.")
                
        await db.commit()
    print("Seed update complete.")

if __name__ == "__main__":
    asyncio.run(seed())
