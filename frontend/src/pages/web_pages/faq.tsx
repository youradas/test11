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
  FaqDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import FaqSection from '../../components/WebPageComponents/FaqComponent';

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

  const faqs = [
    {
      question: 'What features does ${projectName} offer?',
      answer:
        '${projectName} provides a range of features including course creation, student management, instructor profiles, and advanced analytics. These tools are designed to enhance the online learning experience for both educators and students.',
    },
    {
      question: 'How can I integrate ${projectName} with existing systems?',
      answer:
        '${projectName} offers seamless integration with various educational and administrative systems. Our support team can assist you in setting up and ensuring compatibility with your current infrastructure.',
    },
    {
      question: 'Is there a free trial available for ${projectName}?',
      answer:
        'Yes, we offer a free trial period for new users to explore the features and benefits of ${projectName}. This allows you to experience the platform before making a commitment.',
    },
    {
      question: 'How does ${projectName} ensure data security?',
      answer:
        "${projectName} employs advanced security measures to protect user data, including encryption and regular security audits. We prioritize the privacy and safety of our users' information.",
    },
    {
      question: 'Can I customize the platform to suit my needs?',
      answer:
        'Absolutely! ${projectName} is highly customizable, allowing you to tailor the platform to meet your specific educational requirements. Our team is available to assist with any customizations you may need.',
    },
    {
      question: 'What kind of support is available for users?',
      answer:
        'We offer comprehensive support through various channels, including email, chat, and phone. Our dedicated support team is available to assist you with any questions or issues you may encounter.',
    },
    {
      question: 'How does ${projectName} enhance student engagement?',
      answer:
        '${projectName} includes interactive tools such as quizzes, multimedia content, and discussion boards to boost student engagement. These features encourage active participation and improve learning outcomes.',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Frequently Asked Questions - ${projectName}`}</title>
        <meta
          name='description'
          content={`Find answers to common questions about ${projectName}. Learn more about our services, features, and how we can support your online education journey.`}
        />
      </Head>
      <WebSiteHeader projectName={'test11'} pages={pages} />
      <main className={`flex-grow    bg-white  rounded-none  `}>
        <HeroSection
          projectName={'test11'}
          image={['Person reading FAQ on tablet']}
          mainText={`Your Questions Answered at ${projectName}`}
          subTitle={`Explore our comprehensive FAQ section to find answers to your most pressing questions about ${projectName}. We're here to help you navigate your online education journey with ease.`}
          design={HeroDesigns.IMAGE_BG || ''}
          buttonText={`Explore FAQs`}
        />

        <FaqSection
          projectName={'test11'}
          design={FaqDesigns.ACCORDION || ''}
          faqs={faqs}
          mainText={`Frequently Asked Questions About ${projectName} `}
        />
      </main>
      <WebSiteFooter projectName={'test11'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
