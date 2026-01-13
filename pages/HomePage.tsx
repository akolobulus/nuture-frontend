import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import Accordion from '../components/Accordion';
import { faqItems } from '../lib/mockData';
import { BenefitCardIcon } from '../components/IconComponents';

// Access GSAP and ScrollTrigger from the window object
declare const gsap: any;
declare const ScrollTrigger: any;

const benefits = [
    { title: 'Student-Friendly', description: 'Plans designed specifically for NUTM students with affordable pricing.', icon: 'student-friendly' as const },
    { title: 'Easy Claims', description: 'Submit and track claims digitally with real-time status updates.', icon: 'easy-claims' as const },
    { title: 'Health Vault', description: 'Securely store medical records with encrypted decentralized access.', icon: 'vault' as const },
    { title: 'Referral Rewards', description: 'Earn rewards when you refer fellow students to Nuture.', icon: 'referral-rewards' as const },
    { title: 'Flexible Coverage', description: 'Three tiers to match your needs and budget perfectly.', icon: 'flexible-coverage' as const },
];

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Simple Hero Entrance
      gsap.fromTo(".hero-content", 
        { opacity: 0, y: 20 },
        { duration: 0.6, opacity: 1, y: 0, ease: "power2.out", delay: 0.1 }
      );

      // 2. Simple Benefits Stagger
      gsap.fromTo(".benefit-card", 
        { opacity: 0, y: 20 },
        {
          scrollTrigger: {
            trigger: ".benefits-grid",
            start: "top 90%",
            toggleActions: "play none none none"
          },
          duration: 0.5,
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "all"
        }
      );

      // 3. Simple FAQ Reveal
      gsap.fromTo(".faq-section", 
        { opacity: 0, y: 15 },
        {
          scrollTrigger: {
            trigger: ".faq-section",
            start: "top 95%",
          },
          duration: 0.6,
          opacity: 1,
          y: 0,
          ease: "power2.out"
        }
      );

      // 4. Simple CTA Reveal
      gsap.fromTo(".cta-container", 
        { opacity: 0, scale: 0.98 },
        {
          scrollTrigger: {
            trigger: ".cta-container",
            start: "top 95%",
          },
          duration: 0.6,
          opacity: 1,
          scale: 1,
          ease: "power2.out"
        }
      );

      ScrollTrigger.refresh();
    }, mainRef);

    return () => ctx.revert();
  }, [isLoading]);

  if (isLoading) {
    return (
        <div className="space-y-24 pb-24 px-4 overflow-hidden">
            <section className="pt-20 pb-10 flex flex-col items-center">
                <div className="skeleton w-3/4 h-16 rounded-2xl mb-6"></div>
                <div className="skeleton w-1/2 h-8 rounded-xl"></div>
            </section>
            <section className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl"></div>)}
            </section>
        </div>
    );
  }

  return (
    <div ref={mainRef} className="space-y-24 md:space-y-32 pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-10 text-center">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse 85% 70% at 50% 50%, black 35%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 85% 70% at 50% 50%, black 35%, transparent 100%)' }}>
          <div className="absolute inset-0 animate-grid-pan opacity-10 dark:opacity-30" style={{ backgroundImage: 'linear-gradient(to right, #00A859 1px, transparent 1px), linear-gradient(to bottom, #00A859 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
          <div className="absolute inset-0 bg-medical-icons bg-repeat animate-icons-pan opacity-10 dark:opacity-40"></div>
          <div className="absolute inset-0 bg-pulse-wave bg-repeat-x bg-center animate-pulse-pan opacity-20 dark:opacity-60"></div>
        </div>

        <div className="hero-content relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Health Insurance <span className="text-brand-green">Made Simple</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Affordable healthcare coverage designed exclusively for NUTM students. Get protected, stay healthy, and focus on your studies.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button as="link" to="/plans" variant="primary" className="w-full sm:w-auto">View Plans</Button>
            <Button as="link" to="/dashboard" variant="secondary" className="w-full sm:w-auto">Go to Dashboard</Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white transition-colors">Why Choose Nuture?</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors">Built by students, for students. We get it.</p>
        </div>
        <div className="benefits-grid grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="benefit-card bg-white dark:bg-gray-800 p-8 rounded-2xl text-center flex flex-col items-center shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-700/50 hover:border-brand-green dark:hover:border-brand-green transition-all duration-300 group">
              <div className="bg-brand-green/10 dark:bg-brand-green/20 p-4 rounded-full group-hover:animate-float transition-colors">
                <BenefitCardIcon icon={benefit.icon} className="h-8 w-8 text-brand-green" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">{benefit.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Everything you need to know about Nuture and the Health Vault.</p>
        </div>
        <Accordion items={faqItems} />
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cta-container bg-brand-green text-white rounded-[2.5rem] p-12 text-center flex flex-col items-center shadow-2xl shadow-brand-green/20 border-4 border-white/10">
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-full mb-8 animate-float">
               <BenefitCardIcon icon="student-friendly" className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Start Your Journey Today</h2>
            <p className="max-w-xl text-white/80 text-lg mb-10">Join NUTM students who have secured their health with Nuture's flexible coverage.</p>
            <Button as="link" to="/plans" className="!bg-white !text-brand-green hover:!bg-gray-100 !text-xl !px-12 !py-4 shadow-xl transition-transform hover:scale-105">Get Started Now</Button>
          </div>
      </section>
    </div>
  );
};

export default HomePage;