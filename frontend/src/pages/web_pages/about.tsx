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
  AboutUsDesigns,
  FeaturesDesigns,
  TestimonialsDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import AboutUsSection from '../../components/WebPageComponents/AboutUsComponent';

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
      name: 'Interactive Learning Tools',
      description:
        'Engage students with interactive quizzes, multimedia content, and real-time feedback. Enhance the learning experience with dynamic and engaging tools.',
      icon: 'mdiSchool',
    },
    {
      name: 'Comprehensive Analytics',
      description:
        'Gain insights into student performance and course effectiveness with detailed analytics. Make informed decisions to improve educational outcomes.',
      icon: 'mdiChartLine',
    },
    {
      name: 'Seamless Integration',
      description:
        'Easily integrate with existing systems and tools. ${projectName} ensures a smooth transition and compatibility with your current educational infrastructure.',
      icon: 'mdiPuzzle',
    },
  ];

  const testimonials = [
    {
      text: "${projectName} has revolutionized our teaching approach. The platform's intuitive design and robust features have made a significant impact on our students' success.",
      company: 'EduVision Institute',
      user_name: 'Sarah Thompson, Director of Education',
    },
    {
      text: 'The seamless integration and comprehensive analytics provided by ${projectName} have been game-changers for our institution. Highly recommend!',
      company: 'Learning Innovators',
      user_name: 'James Carter, IT Manager',
    },
    {
      text: "Our instructors love the interactive tools offered by ${projectName}. It's made teaching more engaging and effective for everyone involved.",
      company: 'Future Scholars Academy',
      user_name: 'Emily Davis, Lead Instructor',
    },
    {
      text: "Thanks to ${projectName}, we've seen a marked improvement in student engagement and course completion rates. It's a must-have for any educational institution.",
      company: 'Global Learning Hub',
      user_name: 'Michael Brown, Program Coordinator',
    },
    {
      text: 'The support team at ${projectName} is exceptional. They helped us customize the platform to fit our unique needs perfectly.',
      company: 'Innovative Education Solutions',
      user_name: 'Olivia Wilson, Operations Manager',
    },
    {
      text: "With ${projectName}, our students are more motivated and our instructors are more efficient. It's a win-win for everyone!",
      company: 'Bright Future Academy',
      user_name: 'Daniel Lee, Academic Dean',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`About Us - ${projectName}`}</title>
        <meta
          name='description'
          content={`Learn more about ${projectName}, our mission, values, and the innovative features that make us a leader in online education solutions.`}
        />
      </Head>
      <WebSiteHeader projectName={'test11'} pages={pages} />
      <main className={`flex-grow    bg-white  rounded-none  `}>
        <HeroSection
          projectName={'test11'}
          image={['Team brainstorming in modern office']}
          mainText={`Discover the Heart of ${projectName}`}
          subTitle={`At ${projectName}, we are committed to transforming the landscape of online education. Dive into our story, values, and the innovative spirit that drives us forward.`}
          design={HeroDesigns.IMAGE_LEFT || ''}
          buttonText={`Explore Our Journey`}
        />

        <AboutUsSection
          projectName={'test11'}
          image={['Diverse team discussing strategy']}
          mainText={`Our Mission and Vision at ${projectName}`}
          subTitle={`${projectName} is dedicated to empowering educators and learners through cutting-edge technology and innovative solutions. Discover our journey and the values that guide us.`}
          design={AboutUsDesigns.IMAGE_RIGHT || ''}
          buttonText={`Learn More About Us`}
        />

        <FeaturesSection
          projectName={'test11'}
          image={['Icons representing diverse features']}
          withBg={1}
          features={features_points}
          mainText={`Explore ${projectName}'s Innovative Features`}
          subTitle={`${projectName} offers a suite of powerful features designed to enhance the online learning experience for educators and students alike.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS_DIVERSITY || ''}
        />

        <TestimonialsSection
          projectName={'test11'}
          design={TestimonialsDesigns.HORIZONTAL_CAROUSEL_DIVERSITY || ''}
          testimonials={testimonials}
          mainText={`Hear from Our Satisfied Users at ${projectName} `}
        />
      </main>
      <WebSiteFooter projectName={'test11'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
