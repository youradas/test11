import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAppSelector } from '../../stores/hooks';
import LayoutGuest from '../../layouts/Guest';
import WebSiteHeader from '../../components/WebPageComponents/Header';
import WebSiteFooter from '../../components/WebPageComponents/Footer';
import {
  HeroDesigns,
  FeaturesDesigns,
  AboutUsDesigns,
  TestimonialsDesigns,
  ContactFormDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import FeaturesSection from '../../components/WebPageComponents/FeaturesComponent';

import AboutUsSection from '../../components/WebPageComponents/AboutUsComponent';

import TestimonialsSection from '../../components/WebPageComponents/TestimonialsComponent';

import ContactFormSection from '../../components/WebPageComponents/ContactFormComponent';

export default function WebSite() {
  const cardsStyle = useAppSelector((state) => state.style.cardsStyle);
  const bgColor = useAppSelector((state) => state.style.bgLayoutColor);
  const projectName = 'test11';

  useEffect(() => {
    const darkElement = document.querySelector('body .dark');
    if (darkElement) {
      darkElement.classList.remove('dark');
    }
  }, []);
  const pages = [
    {
      href: '/home',
      label: 'home',
    },

    {
      href: '/about',
      label: 'about',
    },

    {
      href: '/services',
      label: 'services',
    },

    {
      href: '/contact',
      label: 'contact',
    },

    {
      href: '/faq',
      label: 'FAQ',
    },
  ];

  const features_points = [
    {
      name: 'Course Creation',
      description:
        'Easily create and customize courses with comprehensive syllabi, resource materials, and assessment tools. Enhance learning experiences with interactive content.',
      icon: 'mdiBookOpenPageVariant',
    },
    {
      name: 'Student Management',
      description:
        'Effortlessly manage student enrollments, track progress, and maintain a detailed database. Ensure personalized learning paths and timely feedback.',
      icon: 'mdiAccountGroup',
    },
    {
      name: 'Instructor Profiles',
      description:
        'Maintain detailed profiles for instructors, showcasing their qualifications and availability. Streamline course assignments and enhance collaboration.',
      icon: 'mdiAccountTie',
    },
  ];

  const testimonials = [
    {
      text: '${projectName} has transformed our online courses, making them more engaging and interactive. Our students love the new features!',
      company: 'EduTech Innovations',
      user_name: 'Alice Johnson, Head of Learning',
    },
    {
      text: 'The intuitive interface and robust analytics of ${projectName} have streamlined our educational processes significantly.',
      company: 'FutureLearn Solutions',
      user_name: 'Michael Smith, Operations Manager',
    },
    {
      text: "Thanks to ${projectName}, our instructors can now focus more on teaching and less on administrative tasks. It's a game-changer!",
      company: 'Bright Minds Academy',
      user_name: 'Emma Brown, Lead Instructor',
    },
    {
      text: "Our enrollment numbers have soared since adopting ${projectName}. The platform's ease of use is unparalleled.",
      company: 'Global Education Hub',
      user_name: 'John Doe, Enrollment Director',
    },
    {
      text: 'The support team at ${projectName} is fantastic! They helped us customize the platform to fit our unique needs perfectly.',
      company: 'Innovative Learning Co.',
      user_name: 'Sophia Lee, IT Specialist',
    },
    {
      text: "With ${projectName}, we've seen a marked improvement in student engagement and course completion rates. Highly recommend!",
      company: 'NextGen Learning',
      user_name: 'David Wilson, Program Coordinator',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Comprehensive Online Education Hub`}</title>
        <meta
          name='description'
          content={`Explore our all-in-one platform for online education, offering course creation, student management, and interactive learning tools for educators and learners.`}
        />
      </Head>
      <WebSiteHeader projectName={'test11'} pages={pages} />
      <main className={`flex-grow    bg-white  rounded-none  `}>
        <HeroSection
          projectName={'test11'}
          image={['Diverse students in virtual class']}
          mainText={`Transform Learning with ${projectName} Today`}
          subTitle={`${projectName} is your all-in-one platform for creating, managing, and delivering online education. Empower educators and engage students with seamless course management and interactive tools.`}
          design={HeroDesigns.IMAGE_BG || ''}
          buttonText={`Get Started Now`}
        />

        <FeaturesSection
          projectName={'test11'}
          image={['Interactive dashboard with analytics']}
          withBg={1}
          features={features_points}
          mainText={`Discover the Power of ${projectName}`}
          subTitle={`Unlock the full potential of online education with ${projectName}'s innovative features designed for educators and learners alike.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS || ''}
        />

        <AboutUsSection
          projectName={'test11'}
          image={['Team collaborating on digital project']}
          mainText={`Empowering Education with ${projectName}`}
          subTitle={`At ${projectName}, we are dedicated to revolutionizing online education by providing a seamless platform for educators and learners. Our mission is to enhance learning experiences through innovative tools and comprehensive management solutions.`}
          design={AboutUsDesigns.IMAGE_RIGHT || ''}
          buttonText={`Learn More About Us`}
        />

        <TestimonialsSection
          projectName={'test11'}
          design={TestimonialsDesigns.MULTI_CARD_DISPLAY || ''}
          testimonials={testimonials}
          mainText={`What Our Users Say About ${projectName} `}
        />

        <ContactFormSection
          projectName={'test11'}
          design={ContactFormDesigns.WITH_IMAGE || ''}
          image={['Person typing on a laptop']}
          mainText={`Get in Touch with ${projectName} `}
          subTitle={`We're here to help! Reach out to us anytime, and our team will respond within 24 hours. Your feedback and inquiries are important to us.`}
        />
      </main>
      <WebSiteFooter projectName={'test11'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
