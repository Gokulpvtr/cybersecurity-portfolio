import {
  FaBug,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaCode,
  FaFlask,
  FaLinux,
  FaLock,
  FaNetworkWired,
  FaBookOpen,
  FaSearch,
  FaShieldAlt,
  FaSitemap,
  FaTerminal,
  FaUserSecret,
} from 'react-icons/fa'

// Keys used by "icon" fields in src/data.js
export const iconMap = {
  shield: FaShieldAlt,
  bug: FaBug,
  network: FaNetworkWired,
  terminal: FaTerminal,
  book: FaBookOpen,
  code: FaCode,
  lock: FaLock,
  secret: FaUserSecret,
  flask: FaFlask,
  linux: FaLinux,
  sitemap: FaSitemap,
  search: FaSearch,
}

// Keys used by `socials` in src/data.js
export const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
  tryhackme: FaTerminal,
  mail: FaEnvelope,
}
