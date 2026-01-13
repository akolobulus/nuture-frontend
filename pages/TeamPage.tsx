
import React, { useEffect, useRef, useState } from 'react';
import { GithubIcon, LinkedinIcon, InstagramIcon, TwitterIcon, SpinnerIcon } from "../components/IconComponents";

declare const gsap: any;
declare const ScrollTrigger: any;

const teamMembers = [
  {
    name: "Akolo Bulus",
    role: "Founder & Tech Lead",
    bio: "Visionary behind Nuture, focused on building accessible and innovative health solutions for the NUTM community.",
    image: "https://api.dicebear.com/8.x/initials/svg?seed=Akolo%20Bulus",
    socials: {
      linkedin: "https://www.linkedin.com/in/akolo-bulus",
      github: "https://github.com/akolobulus",
      instagram: "https://www.instagram.com/heisakolo",
      twitter: "https://x.com/BulusAkolo"
    }
  }
];

const TeamPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Small delay to ensure the DOM is ready and prevent FOUC
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Reveal header
      gsap.fromTo(".team-header", 
        { opacity: 0, y: 30 },
        { duration: 0.8, opacity: 1, y: 0, ease: "power3.out" }
      );

      // Reveal team cards with a stagger
      gsap.fromTo(".team-card", 
        { opacity: 0, y: 40, scale: 0.95 },
        { 
          duration: 0.7, 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          stagger: 0.15, 
          ease: "back.out(1.2)", 
          delay: 0.2,
          clearProps: "all" 
        }
      );

      // Reveal mission section
      gsap.fromTo(".mission-section", 
        { opacity: 0, y: 30 },
        { 
          scrollTrigger: {
            trigger: ".mission-section",
            start: "top 90%",
          },
          duration: 0.8, 
          opacity: 1, 
          y: 0, 
          ease: "power2.out" 
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-40">
        <SpinnerIcon className="w-10 h-10 text-brand-green" />
      </div>
    );
  }

  return (
    <div ref={pageRef} className="relative py-20 px-4 overflow-hidden min-h-[80vh]">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] dark:opacity-[0.07]" 
             style={{ backgroundImage: 'radial-gradient(#00A859 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="team-header text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white tracking-tight">
            The <span className="text-brand-green">Mind</span> Behind Nuture
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Leading the charge to make healthcare accessible for everyone on campus.
          </p>
        </div>

        {/* Team Grid - Adjusted to center a single card */}
        <div className="grid grid-cols-1 gap-10 max-w-lg mx-auto mb-24">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="team-card group bg-white dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700/50 hover:border-brand-green/50 p-8 rounded-[2rem] shadow-xl hover:shadow-brand-green/10 transition-all duration-500"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-brand-green rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="relative w-36 h-36 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{member.name}</h2>
                <p className="text-brand-green font-bold text-sm uppercase tracking-widest mb-4">{member.role}</p>
                
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm leading-relaxed max-w-xs">
                  {member.bio}
                </p>
                
                <div className="flex justify-center gap-4">
                  <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" 
                     className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-700/50 hover:bg-brand-green/20 flex items-center justify-center transition-all duration-300 group/icon">
                    <LinkedinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover/icon:text-brand-green" />
                  </a>
                  <a href={member.socials.github} target="_blank" rel="noopener noreferrer" 
                     className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-700/50 hover:bg-brand-green/20 flex items-center justify-center transition-all duration-300 group/icon">
                    <GithubIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover/icon:text-brand-green" />
                  </a>
                  <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" 
                     className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-700/50 hover:bg-brand-green/20 flex items-center justify-center transition-all duration-300 group/icon">
                    <InstagramIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover/icon:text-brand-green" />
                  </a>
                  <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" 
                     className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-700/50 hover:bg-brand-green/20 flex items-center justify-center transition-all duration-300 group/icon">
                    <TwitterIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover/icon:text-brand-green" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mission-section bg-brand-green text-white rounded-[3rem] p-10 md:p-16 text-center shadow-2xl shadow-brand-green/20 border-4 border-white/10">
          <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Our Mission</h3>
          <p className="text-white/80 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            To make healthcare accessible, transparent, and community-driven for every NUTM student. 
            We believe in empowering students with peace of mind through reliable campus health coverage, 
            promoting responsible healthcare habits, and fostering a supportive student health community.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
