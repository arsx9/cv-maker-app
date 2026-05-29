import type {
  CoverLetterData,
  DocumentStyleSettings,
  ResumeData,
  ResumeSectionId,
  ResumeSectionTitles,
} from './documents'
import { defaultResumeSectionTitles, defaultDocumentTypography } from './documents'

type PartialStyleSettings = Partial<
  Omit<DocumentStyleSettings, 'margins' | 'typography'>
> & {
  margins?: Partial<DocumentStyleSettings['margins']>
  typography?: Partial<DocumentStyleSettings['typography']>
}

type ResumeDataInput = Omit<
  ResumeData,
  'styleSettings' | 'skills' | 'tools' | 'sectionTitles'
> & {
  styleSettings?: PartialStyleSettings
  sectionTitles?: Partial<ResumeSectionTitles>
  skills: {
    technical: string[] | string
    soft: string[] | string
  }
  tools: string[] | string
}

type CoverLetterDataInput = Omit<CoverLetterData, 'styleSettings'> & {
  styleSettings?: PartialStyleSettings
}

export const defaultResumeStyleSettings: DocumentStyleSettings = {
  accentColor: '#1f4db8',
  fontFamily: 'charter',
  pageSize: 'a4',
  gutter: 0.12,
  margins: {
    top: 0.3,
    right: 0.3,
    bottom: 0.3,
    left: 0.3,
  },
  typography: { ...defaultDocumentTypography },
}

export const defaultCoverLetterStyleSettings: DocumentStyleSettings = {
  accentColor: '#2b5fb8',
  fontFamily: 'georgia',
  pageSize: 'a4',
  gutter: 0.12,
  margins: {
    top: 0.3,
    right: 0.3,
    bottom: 0.3,
    left: 0.3,
  },
  typography: { ...defaultDocumentTypography },
}

export const defaultResumeData: ResumeData = {
  personal: {
    fullName: 'Arslan Ali',
    headline: 'Full Stack Web Developer | React | PHP | Laravel',
    location: 'Lahore, Pakistan',
    phone: '+923065815050',
    email: 'arslanali.phpdev@gmail.com',
    links: [
      {
        id: 'linkedin',
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/arslan09/',
      },
    ],
  },
  styleSettings: defaultResumeStyleSettings,
  summary:
    'Computer Science graduate and Full Stack Laravel Developer with over 3+ years of professional experience designing and delivering scalable web applications across a range of complex domains, including CRM systems, lead management platforms, AI agent interfaces, employee management solutions, and patient portals. Specializing in backend development, RESTful API design, and clean architectural practices within the modern Laravel ecosystem, I bring a disciplined, performance-driven approach to every project from initial schema design through to deployment. I am committed to writing maintainable, well-structured code that holds up under real-world demands, and I am actively seeking opportunities to contribute to high-impact engineering teams where strong technical foundations and a drive for continuous growth are equally valued.',
  sectionOrder: [
    'summary',
    'workExperience',
    'selectedProjects',
    'achievements',
    'skills',
    'tools',
    'education',
  ],
  sectionTitles: { ...defaultResumeSectionTitles },
  hiddenSections: [],
  workExperience: [
    {
      id: 'work-1',
      title: 'Software Engineer,',
      subtitle: 'Carpediem Team',
      date: 'November 2024 - Present',
      bullets: [
        'Develop and maintain real-time chat applications using Laravel, Bootstrap, and WebSockets for seamless messaging.',
        'Customize WordPress themes and plugins, including the Voxel theme and Social Chat plugin, to introduce user-specific profile visibility features.',
        'Optimize server performance and deploy applications on AWS EC2 using NGINX, ensuring reliability and high availability.',
        'Automate document handling in Laravel by integrating the JotForm API, enabling seamless document uploads and processing.',
        'Configure and manage cron jobs for scheduled tasks in Laravel, improving automation and data synchronization.',
      ],
    },
    {
      id: 'work-2',
      title: 'Associate Software Engineer,',
      subtitle: 'Mizosoft official',
      date: 'December 2023 - November 2024',
      bullets: [
        'Developed and maintained scalable web applications using the Laravel and Bootstrap frameworks.',
        'Designed and optimized RESTful APIs to facilitate efficient data exchange between the frontend and backend components.',
        'Implemented authentication and authorization systems employing JSON Web Tokens (JWT), OAuth, and social logins, including Google and Facebook.',
        'Enhanced application performance by employing sophisticated caching strategies and optimizing database structures.',
        'Developed role-based access control (RBAC) systems and advanced middleware solutions to improve security measures.',
        'Designed comprehensive API documentation to assist frontend developers and enable seamless third-party integrations.',
        'Operated in an Agile/Scrum environment, collaborating with cross-functional teams to ensure timely and efficient project delivery.',
      ],
    },
    {
      id: 'work-3',
      title: 'Junior Software Engineer,',
      subtitle: 'Gamers Guild',
      date: 'January 2023 - December 2023',
      bullets: [
        'Developed and maintained frontend interfaces utilizing HTML, CSS, JavaScript, and Bootstrap to create a responsive and dynamic Enterprise Resource Planning (ERP) system.',
        'Implemented modular and reusable components to improve user interface consistency and enhance system performance.',
        'Integrated Alpine.js to introduce interactive user interface elements, thereby elevating the overall user experience.',
        'Employed Git for version control, which facilitated effective collaboration and ensured the integrity of the codebase.',
        'Collaborated with senior developers and cross-functional teams to amplify the functionality of the ERP system and to ensure the automation of seamless workflows.',
      ],
    },
    {
      id: 'work-4',
      title: 'Unity Developer,',
      subtitle: 'Game District',
      date: 'March 2021 - December 2022',
      bullets: [
        'Developed 2D and 3D video games utilizing the Unity Engine.',
        'Implemented fundamental gameplay mechanics, user interfaces, and animations effectively.',
        'Optimized game performance to achieve smooth frame rates and minimize memory usage.',
        'Employed Level of Detail (LOD) techniques, texture compression, and graphical processing unit (GPU) optimizations.',
        'Composed clean, modular, and efficient C# scripts to facilitate game logic.',
        'Integrated third-party software development kits (SDKs) for advertising and analytics purposes.',
      ],
    },
  ],
  selectedProjects: [
    {
      id: 'project-1',
      title: 'COOZA.AI - AI-Powered chat Application',
      date: 'Bootstrap & Laravel',
      bullets: [
        'Created cooza.ai, a Laravel application that leverages a Python AI API to provide precise, question-driven answers derived directly from uploaded video threads.',
        'Implemented secure user authentication and authorization for thread access.',
        'Implemented real-time updates and notifications for new answers and thread activity.',
        'Managed the storage and retrieval of video data and AI-generated responses using MySQL.',
      ],
    },
    {
      id: 'project-2',
      title: 'Bluere.com - Rental system',
      date: 'Bootstrap & Laravel',
      bullets: [
        'Developed and maintained a full-stack real estate platform (bluere.com) using Laravel and Bootstrap, enabling property listings, lead capture, and comprehensive admin management.',
        'Implemented key functionalities for a property rental and sales website, including user/admin listing management and lead generation, utilizing Laravel and MySQL.',
      ],
    },
    {
      id: 'project-3',
      title: 'Voxel Theme - Wordpres Theme Modification',
      date: 'Wordpress',
      bullets: [
        'Implemented a feature to allow users to toggle profile visibility per chat.',
        'Developed an AJAX-based solution for real-time updates without page reloads.',
      ],
    },
    {
      id: 'project-4',
      title: 'mobilecarkeysreplacement.com - Car Key Replacement Service',
      date: 'Wordpress',
      bullets: [
        'Build a WordPress-based service website for the replacement of car keys in mobile vehicles.',
        'Integrate booking functions and enhance SEO for better local search visibility.',
      ],
    },
    {
      id: 'project-5',
      title: 'on7.com - Business Portfolio Website',
      date: 'Wordpress',
      bullets: [
        'Develop a professional business portfolio website using WordPress.',
        'Incorporate dynamic sections for services, client testimonials, and case studies.',
      ],
    },
  ],
  achievements: [
    {
      id: 'achievement-1',
      title: 'COOZA.AI - AI-Powered chat Application',
      date: 'Bootstrap & Laravel',
      bullets: [
        'Created cooza.ai, a Laravel application that leverages a Python AI API to provide precise, question-driven answers derived directly from uploaded video threads.',
        'Implemented secure user authentication and authorization for thread access.',
        'Implemented real-time updates and notifications for new answers and thread activity.',
        'Managed the storage and retrieval of video data and AI-generated responses using MySQL.',
      ],
    },
    {
      id: 'achievement-2',
      title: 'Bluere.com - Rental system',
      date: 'Bootstrap & Laravel',
      bullets: [
        'Developed and maintained a full-stack real estate platform (bluere.com) using Laravel and Bootstrap, enabling property listings, lead capture, and comprehensive admin management.',
        'Implemented key functionalities for a property rental and sales website, including user/admin listing management and lead generation, utilizing Laravel and MySQL.',
      ],
    },
    {
      id: 'achievement-3',
      title: 'Voxel Theme - Wordpres Theme Modification',
      date: 'Wordpress',
      bullets: [
        'Implemented a feature to allow users to toggle profile visibility per chat.',
        'Developed an AJAX-based solution for real-time updates without page reloads.',
      ],
    },
    {
      id: 'achievement-4',
      title: 'mobilecarkeysreplacement.com - Car Key Replacement Service',
      date: 'Wordpress',
      bullets: [
        'Build a WordPress-based service website for the replacement of car keys in mobile vehicles.',
        'Integrate booking functions and enhance SEO for better local search visibility.',
      ],
    },
    {
      id: 'achievement-5',
      title: 'on7.com - Business Portfolio Website',
      date: 'Wordpress',
      bullets: [
        'Develop a professional business portfolio website using WordPress.',
        'Incorporate dynamic sections for services, client testimonials, and case studies.',
      ],
    },
  ],
  skills: {
    technical: [
      'HTML',
      'CSS',
      'Javascript',
      'Bootstrap',
      'React',
      'Tailwind CSS',
      'PHP',
      'Laravel Framework',
      'Slim Framework',
      'Codeigniter Framework',
      'C#',
      'MySql',
      'Postgresql',
    ],
    soft: [
      'Problem-solving',
      'Analytical Thinking',
      'Team Collaboration',
      'Adaptability',
      'Time Management',
    ],
  },
  tools: [
    'HTML',
    'CSS',
    'Javascript',
    'Bootstrap',
    'React',
    'Tailwind CSS',
    'PHP',
    'Laravel Framework',
    'Slim Framework',
    'Codeigniter Framework',
    'C#',
    'MySql',
    'Postgresql',
  ],
  education: {
    degree: 'BS Computer Science',
    institution: 'University of Engineering and Technology Lahore, Pakistan',
    date: '2016 - 2020',
  },
}

export function createDefaultCoverLetterData(): CoverLetterData {
  return {
    senderName: defaultResumeData.personal.fullName,
    senderLocation: defaultResumeData.personal.location,
    senderPhone: defaultResumeData.personal.phone,
    senderEmail: defaultResumeData.personal.email,
    senderLinks: defaultResumeData.personal.links,
    styleSettings: defaultCoverLetterStyleSettings,
    recipientName: 'Hiring Manager',
    recipientTitle: 'Engineering Team',
    recipientCompany: 'Target Company',
    recipientAddress: 'Lahore, Pakistan',
    date: new Date().toISOString().slice(0, 10),
    subject: 'Application for Full Stack Developer Role',
    greeting: 'Dear Hiring Manager,',
    paragraphs: [
      'I am writing to express my interest in the Full Stack Developer position at your company. With hands-on experience building Laravel and React applications, I enjoy creating reliable products that balance user experience, maintainability, and performance.',
      'Across CRM systems, chat products, business portals, and WordPress customizations, I have contributed to both frontend and backend delivery, API design, deployment, and performance optimization. I value clean architecture, practical problem solving, and shipping software that supports real business workflows.',
      'I would welcome the opportunity to discuss how my background can support your team. Thank you for your time and consideration.',
    ],
    closing: 'Sincerely,',
    signature: defaultResumeData.personal.fullName,
  }
}

export const defaultCoverLetterData: CoverLetterData = createDefaultCoverLetterData()

export function createCoverLetterFromResume(resume: ResumeData): CoverLetterData {
  return {
    ...createDefaultCoverLetterData(),
    senderName: resume.personal.fullName,
    senderLocation: resume.personal.location,
    senderPhone: resume.personal.phone,
    senderEmail: resume.personal.email,
    senderLinks: resume.personal.links,
    styleSettings: {
      ...resume.styleSettings,
    },
    signature: resume.personal.fullName,
  }
}

export function normalizeTypography(
  input: Partial<DocumentStyleSettings['typography']> | undefined,
  defaults: DocumentStyleSettings['typography'],
): DocumentStyleSettings['typography'] {
  function clampSize(value: number | undefined, fallback: number) {
    if (typeof value !== 'number') {
      return fallback
    }

    return Math.min(Math.max(value, 7), 24)
  }

  return {
    nameSize: clampSize(input?.nameSize, defaults.nameSize),
    nameBold:
      typeof input?.nameBold === 'boolean' ? input.nameBold : defaults.nameBold,
    headerTextSize: clampSize(input?.headerTextSize, defaults.headerTextSize),
    headerTextBold:
      typeof input?.headerTextBold === 'boolean'
        ? input.headerTextBold
        : defaults.headerTextBold,
    sectionTitleSize: clampSize(input?.sectionTitleSize, defaults.sectionTitleSize),
    sectionTitleBold:
      typeof input?.sectionTitleBold === 'boolean'
        ? input.sectionTitleBold
        : defaults.sectionTitleBold,
    subheadingSize: clampSize(input?.subheadingSize, defaults.subheadingSize),
    subheadingBold:
      typeof input?.subheadingBold === 'boolean'
        ? input.subheadingBold
        : defaults.subheadingBold,
    bodySize: clampSize(input?.bodySize, defaults.bodySize),
    bodyBold:
      typeof input?.bodyBold === 'boolean' ? input.bodyBold : defaults.bodyBold,
    tagSize: clampSize(input?.tagSize, defaults.tagSize),
    tagBold:
      typeof input?.tagBold === 'boolean' ? input.tagBold : defaults.tagBold,
  }
}

export function normalizeStyleSettings(
  input: PartialStyleSettings | undefined,
  defaults: DocumentStyleSettings,
): DocumentStyleSettings {
  return {
    accentColor: input?.accentColor || defaults.accentColor,
    fontFamily: input?.fontFamily || defaults.fontFamily,
    pageSize: input?.pageSize || defaults.pageSize,
    gutter:
      typeof input?.gutter === 'number' ? input.gutter : defaults.gutter,
    margins: {
      top:
        typeof input?.margins?.top === 'number'
          ? input.margins.top
          : defaults.margins.top,
      right:
        typeof input?.margins?.right === 'number'
          ? input.margins.right
          : defaults.margins.right,
      bottom:
        typeof input?.margins?.bottom === 'number'
          ? input.margins.bottom
          : defaults.margins.bottom,
      left:
        typeof input?.margins?.left === 'number'
          ? input.margins.left
          : defaults.margins.left,
    },
    typography: normalizeTypography(input?.typography, defaults.typography),
  }
}

export function normalizeSectionTitles(
  input: Partial<ResumeSectionTitles> | undefined,
): ResumeSectionTitles {
  const titles = { ...defaultResumeSectionTitles }

  if (input) {
    for (const sectionId of Object.keys(
      defaultResumeSectionTitles,
    ) as ResumeSectionId[]) {
      const title = input[sectionId]

      if (typeof title === 'string' && title.trim()) {
        titles[sectionId] = title.trim()
      }
    }
  }

  return titles
}

export function normalizeResumeData(input: ResumeDataInput): ResumeData {
  return {
    ...input,
    sectionTitles: normalizeSectionTitles(input.sectionTitles),
    skills: {
      technical: normalizeStringList(input.skills.technical),
      soft: normalizeStringList(input.skills.soft),
    },
    tools: normalizeStringList(input.tools),
    styleSettings: normalizeStyleSettings(
      input.styleSettings,
      defaultResumeStyleSettings,
    ),
  }
}

export function normalizeCoverLetterData(
  input: CoverLetterDataInput,
): CoverLetterData {
  return {
    ...input,
    styleSettings: normalizeStyleSettings(
      input.styleSettings,
      defaultCoverLetterStyleSettings,
    ),
  }
}

function normalizeStringList(input: string[] | string | undefined): string[] {
  if (Array.isArray(input)) {
    return input
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof input === 'string') {
    return input
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}
