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
    subtitle: 'Senior Software Engineer',
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
        // {
        //     text: 'About',
        //     href: '/about'
        // },
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
        title: 'Fault-tolerant || Curiosity-driven || Production-tested.',
        text: "I'm Subhendu Ghosh, a backend engineer with about a decade of experience building distributed systems that keep running when things get messy. I've spent my career designing event-driven pipelines, scaling microservices, and untangling legacy systems across HR tech, workflow automation, and data-heavy platforms. My toolkit centers on Python, Kafka, PostgreSQL, and AWS, with Spark, Airflow close at hand. These days I'm also exploring AI tooling, building small agents and integrations to see what they're really good for. This site is where I write it all down: the designs that worked, the incidents that taught me something, and the experiments I couldn't resist.\n\nFeel free to explore some of my coding endeavors on [GitHub](https://github.com/codenamesubho) or follow me on [Linkedin](https://linkedin.com/in/codenamesubho).",
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
