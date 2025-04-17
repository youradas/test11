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
  TestimonialsDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import FeaturesSection from '../../components/WebPageComponents/FeaturesComponent';

import TestimonialsSection from '../../components/WebPageComponents/TestimonialsComponent';

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
      name: 'Custom Course Development',
      description:
        'Create tailored courses with ease using our intuitive tools. Enhance learning with multimedia content and interactive elements.',
      icon: 'mdiBookPlus',
    },
    {
      name: 'Advanced Student Analytics',
      description:
        'Track student progress and performance with detailed analytics. Make data-driven decisions to improve educational outcomes.',
      icon: 'mdiChartBar',
    },
    {
      name: 'Seamless System Integration',
      description:
        'Integrate ${projectName} with your existing systems effortlessly. Ensure a smooth transition and compatibility with your current infrastructure.',
      icon: 'mdiPuzzleOutline',
    },
  ];

  const testimonials = [
    {
      text: '${projectName} has been a game-changer for our institution. The seamless integration and user-friendly interface have made a significant impact on our operations.',
      company: 'EduTech Solutions',
      user_name: 'Anna Roberts, Chief Technology Officer',
    },
    {
      text: 'The analytics provided by ${projectName} have allowed us to make informed decisions that have improved student outcomes. Highly recommend!',
      company: 'Learning Innovations Inc.',
      user_name: 'Mark Johnson, Director of Education',
    },
    {
      text: "Our instructors love the flexibility and customization options offered by ${projectName}. It's made course creation a breeze.",
      company: 'FutureLearn Academy',
      user_name: 'Jessica Lee, Lead Instructor',
    },
    {
      text: 'Thanks to ${projectName}, our student engagement has increased dramatically. The interactive tools are a hit with our learners.',
      company: 'Bright Minds Institute',
      user_name: 'David Kim, Program Coordinator',
    },
    {
      text: 'The support team at ${projectName} is exceptional. They helped us tailor the platform to meet our specific needs perfectly.',
      company: 'Innovative Learning Co.',
      user_name: 'Emily Davis, Operations Manager',
    },
    {
      text: "With ${projectName}, we've seen a marked improvement in course completion rates. It's a must-have for any educational institution.",
      company: 'Global Education Hub',
      user_name: 'Michael Brown, Academic Dean',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Our Services - ${projectName}`}</title>
        <meta
          name='description'
          content={`Discover the range of services offered by ${projectName}, designed to enhance online education through innovative solutions and comprehensive support.`}
        />
      </Head>
      <WebSiteHeader projectName={'test11'} pages={pages} />
      <main className={`flex-grow    bg-white  rounded-none  `}>
        <HeroSection
          projectName={'test11'}
          image={['Diverse team collaborating on project']}
          mainText={`Unlock Educational Excellence with ${projectName}`}
          subTitle={`Explore the diverse services offered by ${projectName} to elevate your online education experience. From course creation to student engagement, we provide comprehensive solutions tailored to your needs.`}
          design={HeroDesigns.IMAGE_BG || ''}
          buttonText={`Discover Our Services`}
        />

        <FeaturesSection
          projectName={'test11'}
          image={['Icons representing various services']}
          withBg={0}
          features={features_points}
          mainText={`Comprehensive Services Offered by ${projectName}`}
          subTitle={`${projectName} provides a suite of services designed to enhance the online learning experience, ensuring success for educators and students alike.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS || ''}
        />

        <TestimonialsSection
          projectName={'test11'}
          design={TestimonialsDesigns.HORIZONTAL_CAROUSEL || ''}
          testimonials={testimonials}
          mainText={`What Our Clients Say About ${projectName} `}
        />
      </main>
      <WebSiteFooter projectName={'test11'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
