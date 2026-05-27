type Entry = {
  title: string
  company?: string
  date: string
  bullets: string[]
}

const workExperience: Entry[] = [
  {
    title: 'Software Engineer,',
    company: 'Carpediem Team',
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
    title: 'Associate Software Engineer,',
    company: 'Mizosoft official',
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
    title: 'Junior Software Engineer,',
    company: 'Gamers Guild',
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
    title: 'Unity Developer,',
    company: 'Game District',
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
]

const selectedProjects: Entry[] = [
  {
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
    title: 'Bluere.com - Rental system',
    date: 'Bootstrap & Laravel',
    bullets: [
      'Developed and maintained a full-stack real estate platform (bluere.com) using Laravel and Bootstrap, enabling property listings, lead capture, and comprehensive admin management.',
      'Implemented key functionalities for a property rental and sales website, including user/admin listing management and lead generation, utilizing Laravel and MySQL.',
    ],
  },
  {
    title: 'Voxel Theme - Wordpres Theme Modification',
    date: 'Wordpress',
    bullets: [
      'Implemented a feature to allow users to toggle profile visibility per chat.',
      'Developed an AJAX-based solution for real-time updates without page reloads.',
    ],
  },
  {
    title: 'mobilecarkeysreplacement.com - Car Key Replacement Service',
    date: 'Wordpress',
    bullets: [
      'Build a WordPress-based service website for the replacement of car keys in mobile vehicles.',
      'Integrate booking functions and enhance SEO for better local search visibility.',
    ],
  },
  {
    title: 'on7.com - Business Portfolio Website',
    date: 'Wordpress',
    bullets: [
      'Develop a professional business portfolio website using WordPress.',
      'Incorporate dynamic sections for services, client testimonials, and case studies.',
    ],
  },
]

const achievements = [...selectedProjects]

function renderEntry(entry: Entry) {
  return (
    <div className="entry" key={`${entry.title}-${entry.date}`}>
      <div className="entry-header">
        <span>
          <strong>{entry.title}</strong>{' '}
          {entry.company ? <span className="company">{entry.company}</span> : null}
        </span>
        <span className="date">{entry.date}</span>
      </div>
      <ul className="bullets">
        {entry.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  return (
    <main className="page">
      <header className="cv-header">
        <h1 className="name">Arslan Ali</h1>
        <p className="designation">
          Full Stack Web Developer <span className="sep">|</span>
          React <span className="sep">|</span>
          PHP <span className="sep">|</span>
          Laravel
        </p>
        <p className="contact">
          Lahore, Pakistan <span className="sep">|</span>
          <a href="tel:+923065815050">+923065815050</a>
          <span className="sep">|</span>
          <a href="mailto:arslanali.phpdev@gmail.com">arslanali.phpdev@gmail.com</a>
          <span className="sep">|</span>
          <a
            href="https://www.linkedin.com/in/arslan09/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </p>
      </header>

      <section className="cv-section">
        <h2 className="section-title">Professional Summary</h2>
        <p className="summary">
          Computer Science graduate and Full Stack Laravel Developer with over
          3+ years of professional experience designing and delivering scalable
          web applications across a range of complex domains, including CRM
          systems, lead management platforms, AI agent interfaces, employee
          management solutions, and patient portals. Specializing in backend
          development, RESTful API design, and clean architectural practices
          within the modern Laravel ecosystem, I bring a disciplined,
          performance-driven approach to every project from initial schema
          design through to deployment. I am committed to writing maintainable,
          well-structured code that holds up under real-world demands, and I am
          actively seeking opportunities to contribute to high-impact
          engineering teams where strong technical foundations and a drive for
          continuous growth are equally valued.
        </p>
      </section>

      <section className="cv-section">
        <h2 className="section-title">Work Experience</h2>
        {workExperience.map(renderEntry)}
      </section>

      <section className="cv-section">
        <h2 className="section-title">Selected Projects</h2>
        {selectedProjects.map(renderEntry)}
      </section>

      <section className="cv-section">
        <h2 className="section-title">Achivements</h2>
        {achievements.map(renderEntry)}
      </section>

      <section className="cv-section">
        <h2 className="section-title">Skills</h2>
        <p className="skill-line">
          <strong>Technical skills:</strong> HTML, CSS, Javascript, Bootstrap,
          React, Tailwind CSS, PHP, Laravel Framework, Slim Framework,
          Codeigniter Framework, C#, MySql, Postgresql
        </p>
        <p className="skill-line">
          <strong>Soft Skills:</strong> Problem-solving, Analytical Thinking,
          Team Collaboration, Adaptability, Time Management
        </p>
      </section>

      <section className="cv-section">
        <h2 className="section-title">Tools</h2>
        <p className="skill-line">
          HTML, CSS, Javascript, Bootstrap, React, Tailwind CSS, PHP, Laravel
          Framework, Slim Framework, Codeigniter Framework, C#, MySql,
          Postgresql
        </p>
      </section>

      <section className="cv-section">
        <h2 className="section-title">Education</h2>
        <div className="education-row">
          <span>
            <strong>BS Computer Science</strong>
          </span>
          <span className="education-mid">
            University of Engineering and Technology Lahore, Pakistan
          </span>
          <span className="date">2016 - 2020</span>
        </div>
      </section>
    </main>
  )
}

export default App
