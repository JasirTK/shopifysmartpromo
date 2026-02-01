import { getAllContent } from '@/lib/api';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import LogoCloud from '@/components/LogoCloud';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import ShopifyIntegrationSection from '@/components/ShopifyIntegrationSection';
import PricingSection from '@/components/PricingSection';
import MockupGenerator from '@/components/tools/MockupGenerator';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import FloatingChatbot from '@/components/FloatingChatbot';

// Force dynamic rendering since we are fetching from local API
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const content = await getAllContent();
  const seoData = content.find((c: any) => c.key === 'seo')?.content;

  return {
    title: seoData?.title || 'Smart Promo & Insights',
    description: seoData?.description || 'Optimize your Shopify store with AI.',
  };
}

export default async function Home() {
  const contentList = await getAllContent();

  // Helper to find section content
  const getContent = (key: string) => contentList.find((c: any) => c.key === key)?.content;

  return (
    <main className="min-h-screen bg-brand-dark font-sans selection:bg-brand-primary/30 selection:text-brand-primary-light">
      <Navbar />

      <HeroSection content={getContent('hero')} />
      <LogoCloud />
      <FeaturesSection content={getContent('features')} />
      <HowItWorksSection content={getContent('how_it_works')} />
      <ShopifyIntegrationSection content={getContent('shopify_integration')} />

      <PricingSection content={getContent('pricing')} />

      <MockupGenerator />

      <TestimonialsSection content={getContent('testimonials')} />

      {/* Visual Separator */}
      <div className="h-24 bg-gradient-to-b from-brand-dark to-brand-surface/50"></div>

      <CTASection content={getContent('cta_bottom')} />

      <Footer />
      <FloatingChatbot />
    </main>
  );
}
