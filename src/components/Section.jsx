import { motion } from 'framer-motion'

// Each word's own reveal animation (used as a Framer Motion variant so the
// whole heading is watched as one element instead of one tiny observer per word).
const wordVariants = {
  hidden: { y: '118%', rotate: 5 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.95, ease: [0.2, 0.8, 0.2, 1] } },
}

// Section wrapper. The heading slides up word by word from behind a mask.
export default function Section({ id, title, meta, children, className = '' }) {
  const words = title.split(' ')
  return (
    <section id={id} className={`section ${className}`}>
      <div className="container">
        <header className="section-head">
          <motion.h2
            aria-label={title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ staggerChildren: 0.09 }}
          >
            {words.map((w, i) => (
              <span key={`${w}-${i}`}>
                <span className="word-mask" aria-hidden="true">
                  <motion.span className="word" variants={wordVariants}>
                    {w}
                  </motion.span>
                </span>{' '}
              </span>
            ))}
          </motion.h2>
          {meta && (
            <motion.p
              className="section-meta"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.8 }}
            >
              {meta}
            </motion.p>
          )}
        </header>
        {children}
      </div>
    </section>
  )
}
