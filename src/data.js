// ======================================================================
//  EDIT THIS FILE to change the content of the whole portfolio.
//  You do not need to touch any other file for normal updates.
//
//  Search for "EDIT" to find things you should double check.
// ======================================================================

export const profile = {
  name: 'Gokulkrishnan S',
  logo: '<GK/>',

  // The line under your name types through these, one after another.
  roles: [
    'Aspiring Penetration Tester',
    'Web Application Security Learner',
    'Bug Bounty Learner',
  ],

  intro:
    'BCA student focused on offensive security. I practice on PortSwigger and TryHackMe, write up what I learn, and build small tools to go with it. Everything is public on GitHub.',

  // Small tags under the intro.
  focus: ['Ethical Hacking', 'Penetration Testing', 'Web Application Security'],

  // Put your photo at  public/profile.jpg  (see README). Set to '' to show initials.
  photo: 'profile.jpg',

  // EDIT: put your resume at public/resume.pdf and set this to 'resume.pdf'.
  // While it is null, the Download Resume button is hidden.
  resume: null,

  email: 'gokulkrishnanorg@gmail.com',
  linkedin: 'https://www.linkedin.com/in/gokulkrishnan-bca/',
  tryhackme: 'https://tryhackme.com/p/Gokulkrishnan',

  github: 'https://github.com/Gokulpvtr',

  contactTitle: "Let's talk security.",
  contactText:
    "I'm looking for internships and entry-level opportunities in cybersecurity. If you have a role, a question, or want to collaborate, email me or find me on any of these.",
}

// Social links. `handle` is the text shown on the contact cards.
export const socials = [
  { key: 'github', label: 'GitHub', handle: 'Gokulpvtr', href: profile.github },
  { key: 'linkedin', label: 'LinkedIn', handle: 'gokulkrishnan-bca', href: profile.linkedin },
  { key: 'tryhackme', label: 'TryHackMe', handle: 'Gokulkrishnan', href: profile.tryhackme },
  { key: 'mail', label: 'Email', handle: profile.email, href: `mailto:${profile.email}` },
]

// Glass tags that float around the 3D sphere in the hero (desktop only).
// x / y are percentages of the hero. depth changes how far they move with the cursor.
export const floatTags = [
  { text: 'SQL injection', x: 60, y: 17, depth: 1.0, color: '#00ff88' },
  { text: 'XSS', x: 86, y: 25, depth: 1.5, color: '#00d9ff' },
  { text: 'IDOR', x: 57, y: 70, depth: 0.8, color: '#7c6bff' },
  { text: 'SSRF', x: 88, y: 62, depth: 1.3, color: '#00ff88' },
  { text: 'Burp Suite', x: 72, y: 82, depth: 1.1, color: '#00d9ff' },
  { text: 'Recon', x: 74, y: 9, depth: 0.7, color: '#7c6bff' },
]

// The two sliding text bands under the hero.
export const marquee = {
  top: ['Web Application Security', 'Penetration Testing', 'Bug Bounty', 'Ethical Hacking'],
  bottom: ['Burp Suite', 'Nmap', 'Wireshark', 'Kali Linux', 'Python', 'Linux', 'Bash', 'Metasploit'],
}

export const nav = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'methodology', label: 'Methodology' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

// The stat cards under the hero.
//  - value: a number you type in
//  - from: 'certifications' or 'projects' counts the items below automatically
// EDIT: only keep numbers you can back up if someone asks.
export const stats = [
  { label: 'Vulnerability classes practiced', value: 12 },
  { label: 'Labs completed', value: 25, suffix: '+' },
  { label: 'Certifications', from: 'certifications' },
  { label: 'GitHub repositories', from: 'projects' },
]

export const about = {
  paragraphs: [
    "I'm a BCA student at the University of Kerala. I got into cybersecurity by wondering how systems work and how they break.",
    'My main interests are offensive security and web application security. I work through PortSwigger Web Security Academy and TryHackMe labs and write up each one: what the flaw is, how I exploited it, and how it should be fixed.',
    "I keep notes on every vulnerability class I study and build small Python tools. I'm getting ready for real bug bounty programs by learning scope, recon, and reporting first.",
  ],
  facts: [
    { label: 'Studying', value: 'BCA, University of Kerala' },
    { label: 'Focus', value: 'Web application security' },
    { label: 'Practicing on', value: 'PortSwigger Academy, TryHackMe' },
    { label: 'Next goal', value: 'First valid bug bounty report' },
  ],
}

// icon keys: shield, bug, network, terminal, book, code, lock, secret, flask, linux, sitemap, search
export const methodology = [
  {
    step: '01',
    title: 'Recon',
    icon: 'search',
    text: 'Map the target: subdomains, technologies, endpoints, and exposed files, staying inside scope.',
  },
  {
    step: '02',
    title: 'Enumerate',
    icon: 'network',
    text: 'Walk every feature and role to find what an attacker could reach: hidden endpoints, parameters, roles.',
  },
  {
    step: '03',
    title: 'Test',
    icon: 'bug',
    text: 'Work through a checklist for each vulnerability class: injection, access control, auth, logic flaws.',
  },
  {
    step: '04',
    title: 'Validate',
    icon: 'flask',
    text: 'Reproduce the finding, minimize the proof of concept, and confirm the real impact before reporting.',
  },
  {
    step: '05',
    title: 'Report',
    icon: 'book',
    text: 'Write it up clearly: steps to reproduce, impact, and a fix, the way a real disclosure report reads.',
  },
]

export const skills = [
  {
    title: 'Offensive security',
    icon: 'shield',
    items: [
      'SQL injection',
      'XSS',
      'CSRF',
      'SSRF',
      'IDOR and access control',
      'Authentication flaws',
      'File upload',
      'Command injection',
      'Path traversal',
      'XXE',
      'Clickjacking',
      'Business logic',
      'Privilege escalation',
      'Enumeration',
    ],
  },
  {
    title: 'Tools',
    icon: 'terminal',
    items: [
      'Burp Suite',
      'Nmap',
      'Wireshark',
      'Kali Linux',
      'Gobuster',
      'Metasploit',
      'John the Ripper',
      'Nikto',
    ],
  },
  {
    title: 'Foundations',
    icon: 'code',
    items: [
      'Linux administration',
      'Bash',
      'Python',
      'HTTP',
      'TCP/IP networking',
      'Cisco Packet Tracer',
      'Git and GitHub',
      'HTML and CSS',
    ],
  },
]

// status: 'active' | 'progress' | 'planned'
// A 'planned' repo shows "coming soon" instead of a link.
// When you create the repo on GitHub, change its status to 'active' and the
// link appears by itself. Add  url: '...'  to override the GitHub link.
export const projects = [
  {
    repo: 'VulnScope',
    icon: 'bug',
    status: 'active',
    description:
      'Web-based vulnerability scanner built with Flask and python-nmap. Runs real network scans, maps findings to a local knowledge base, and exports PDF, HTML, and JSON reports.',
    tags: ['Flask', 'python-nmap', 'SQLite', 'ReportLab'],
  },
  {
    repo: 'portswigger-writeups',
    icon: 'flask',
    status: 'active',
    description:
      'Web Security Academy lab write-ups: the vulnerability, exploit steps, root cause, and the fix.',
    tags: ['Burp Suite', 'SQLi', 'XSS', 'Access control'],
  },
  {
    repo: 'tryhackme-writeups',
    icon: 'secret',
    status: 'active',
    description:
      'Room walkthroughs covering recon, enumeration, exploitation, and privilege escalation.',
    tags: ['TryHackMe', 'Enumeration', 'Privilege escalation'],
  },
  {
    repo: 'python-port-scanner',
    icon: 'search',
    status: 'active',
    description:
      'Multi-threaded TCP port scanner in Python with service detection and banner grabbing.',
    tags: ['Python', 'Sockets', 'Threading', 'Recon'],
  },
  {
    repo: 'cybersecurity-portfolio',
    icon: 'shield',
    status: 'active',
    description:
      'The hub for my security journey: certifications, roadmap, and links to every project.',
    tags: ['Portfolio', 'Roadmap'],
  },
  {
    repo: 'nmap-labs',
    icon: 'network',
    status: 'progress',
    description:
      'Scanning practice against lab machines, with a written assessment report for each target.',
    tags: ['Nmap', 'Enumeration', 'Reporting'],
  },
  {
    repo: 'bug-bounty-methodology',
    icon: 'bug',
    status: 'progress',
    description:
      'My recon and testing workflow: scope review, recon, a testing checklist, and a report template.',
    tags: ['Bug bounty', 'Recon', 'Checklist'],
  },
  {
    repo: 'wireshark-analysis',
    icon: 'network',
    status: 'active',
    description:
      'Packet captures and protocol analysis from lab environments, plus a display filter cheatsheet.',
    tags: ['Wireshark', 'TCP/IP', 'HTTP', 'DNS'],
  },
  {
    repo: 'networking-notes',
    icon: 'sitemap',
    status: 'active',
    description: 'Networking study notes: OSI, subnetting, routing, VLANs, ACLs, NAT, and DHCP.',
    tags: ['Networking', 'CCNA topics'],
  },
  {
    repo: 'linux-note',
    icon: 'linux',
    status: 'active',
    description: 'Linux commands, permissions, services, and Bash scripting notes with exercises.',
    tags: ['Linux', 'Bash'],
  },
  {
    repo: 'packet-tracer-labs',
    icon: 'sitemap',
    status: 'active',
    description: 'Cisco Packet Tracer designs covering VLANs, routing, ACLs, DHCP, and NAT.',
    tags: ['Cisco', 'Packet Tracer'],
  },
]

// Certificate images live in public/certs/. Click a card on the site to flip it.
// `url` adds a "Verify credential" link (leave '' for none).
// EDIT: click each verify link once to confirm it opens the right certificate.
export const certifications = [
  {
    title: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google, via Coursera',
    date: 'August 2026',
    image: 'certs/google-cybersecurity.jpg',
    url: 'https://coursera.org/verify/professional-cert/6AQ28904C7DW',
  },
  {
    title: 'Introduction to Ethical Hacking',
    issuer: 'Offenso Hackers Academy',
    date: 'April 2026',
    image: 'certs/offenso-ethical-hacking.jpg',
    url: '',
  },
  {
    title: 'Malware Analysis Introduction',
    issuer: 'Red Team Leaders',
    date: 'April 2026',
    image: 'certs/malware-analysis.jpg',
    url: 'https://courses.redteamleaders.com/completion/8390b248f71c7df3',
  },
  {
    title: 'SQL Injection Attacks',
    issuer: 'CodeRed',
    date: 'March 2026',
    image: 'certs/codered-sql-injection.jpg',
    url: '',
  },
  {
    title: 'Ethically Hack the Planet',
    issuer: 'Udemy',
    date: 'February 2026',
    image: 'certs/udemy-ethically-hack-the-planet.jpg',
    url: 'https://ude.my/UC-01cd1e94-866d-495a-9fa6-cc7afd40187f',
  },
  {
    title: 'Kali Linux for Ethical Hackers',
    issuer: 'Udemy',
    date: 'January 2026',
    image: 'certs/udemy-kali-linux.jpg',
    url: 'https://ude.my/UC-90ab28c5-058f-44a6-a95d-93049cb5c89d',
  },
  {
    title: 'Cybersecurity Fundamentals',
    issuer: 'IBM SkillsBuild',
    date: 'September 2026',
    image: 'certs/ibm-cybersecurity-fundamentals.jpg',
    url: 'https://www.credly.com/badges/a156c0d7-390c-4217-a594-c3320b03d004',
  },
  {
    title: 'Artificial Intelligence for Cybersecurity',
    issuer: 'LinkedIn Learning',
    date: 'September 2026',
    image: 'certs/linkedin-ai-cybersecurity.jpg',
    url: '',
  },
  {
    title: 'Cybersecurity',
    issuer: 'Tech Mahindra Foundation, Skill India',
    date: 'November 2025',
    image: 'certs/techmahindra-cybersecurity.jpg',
    url: '',
  },
  {
    title: 'Networking Basics',
    issuer: 'Cisco Networking Academy',
    date: 'August 2026',
    image: 'certs/cisco-networking-basics.jpg',
    url: '',
  },
  {
    title: 'Getting Started with Cisco Packet Tracer',
    issuer: 'Cisco Networking Academy',
    date: 'June 2026',
    image: 'certs/cisco-packet-tracer.jpg',
    url: '',
  },
  {
    title: 'Wiz Bug Bounty Masterclass',
    issuer: 'Wiz',
    date: 'Issued Sep 2026 · Expires Sep 2028',
    image: 'certs/wiz-bug-bounty-masterclass.jpg',
    url: '',
  },
]

// type: 'work' | 'edu'
export const timeline = [
  {
    type: 'work',
    title: 'Web Development Intern',
    org: 'Wogle Tech',
    period: 'June 2025 – July 2025',
    points: [
      'Built pages for web projects with HTML5 and CSS3, focusing on responsive layouts.',
      'Learned how web architecture, HTTP, and client-server communication fit together.',
      'Worked with a team on several projects.',
      'Started spotting possible vulnerabilities while building, which pushed me toward security.',
    ],
  },
  {
    type: 'edu',
    title: 'Bachelor of Computer Applications (BCA)',
    org: 'University of Kerala',
    // EDIT: check these years so they match your LinkedIn and resume.
    period: '2024 – 2028',
    points: ['Security training through labs, courses, and certifications alongside the degree.'],
  },
]
