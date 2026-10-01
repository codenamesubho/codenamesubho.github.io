import avatar from '../assets/images/avatar.jpg';
import hero from '../assets/images/hero.jpg';
import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
    website: 'https://codenamesubho.dev',
    avatar: {
        src: avatar,
        alt: 'Subhendu Ghosh'
    },
    title: 'Codenamesubho',
    subtitle: 'Senior Software Engineer III',
    description: 'Blog and Portfolio',
    image: {
        src: '/dante-preview.jpg',
        alt: 'Dante - Astro.js and Tailwind CSS theme'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Projects',
            href: '/projects'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
        },
        {
            text: 'Terms',
            href: '/terms'
        },
        {
            text: 'Download theme',
            href: 'https://github.com/JustGoodUI/dante-astro-theme'
        }
    ],
    socialLinks: [
        {
            text: 'Linkedin',
            href: 'https://linkedin.com/in/codenamesubho'
        },
        {
            text: 'Github',
            href: 'https://github.com/codenamesubho'
        },
        {
            text: 'X/Twitter',
            href: 'https://x.com/_no_rules_'
        }
    ],
    hero: {
        title: 'Hi There & Welcome to My Corner of the Web!',
        text: "Senior Software Engineer with 10 years of experience building scalable distributed backend systems and microservices in fast-paced environments. Architected event-driven pipelines processing 50GB+ data per day and led a team of engineers through complex projects and cross-functional migrations. Deep expertise in Python, Kafka, PostgreSQL and AWS. Known for driving technical initiatives end-to-end and delivering under ambiguity.\n\nFeel free to explore some of my coding endeavors on [GitHub](https://github.com/codenamesubho) or follow me on [Linkedin](https://linkedin.com/in/codenamesubho).",
        image: {
            src: hero,
            alt: 'A person sitting at a desk in front of a computer'
        },
        actions: [
            {
                text: 'Get in Touch',
                href: '/contact'
            }
        ]
    },
    subscribe: {
        enabled: true,
        title: 'Subscribe to Codenamesubho Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        form: {
            action: '#'
        }
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
