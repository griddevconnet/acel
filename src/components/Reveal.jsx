import { motion } from 'framer-motion'

/**
 * Deliberate, restrained scroll entrance: used once per section (the
 * section heading group), not on every card inside it. Individual
 * items within a section instead stagger from a shared parent — see
 * StaggerGroup / StaggerItem.
 */
export default function Reveal({ children, className = '', delay = 0, y = 22 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerGroup({ children, className = '', stagger = 0.08, as = 'div' }) {
  const Comp = motion[as] || motion.div
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </Comp>
  )
}

export function StaggerItem({ children, className = '', as = 'div' }) {
  const Comp = motion[as] || motion.div
  return (
    <Comp
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </Comp>
  )
}
