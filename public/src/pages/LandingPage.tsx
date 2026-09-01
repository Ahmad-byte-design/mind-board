import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { fadeUp } from '@/lib/motion'
import { Image, PrimaryBtn, SecondaryBtn } from '@/components/ui'
import landingImg from '@/assets/images/bg-landing.jpg'
import logo from '@/assets/images/logo.png'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Image
        src={landingImg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink-deep/70" />
      <motion.div {...fadeUp} className="relative z-10">
        <div className="brand-mark mb-8 flex items-center justify-center gap-3">
          <Image
            src={logo}
            alt="Loom"
            className="h-12 w-12 rounded-xl object-cover shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
          />
          <b className="font-sans text-3xl font-semibold text-paper">Loom</b>
        </div>

        <h1 className="mb-4 font-hand text-5xl text-paper lg:text-6xl">
          Your quiet corner for<br />
          <em className="text-gold">big ideas.</em>
        </h1>

        <p className="mb-10 max-w-md text-lg text-text-dark-muted">
          A learning room where curiosity finds its map, and every thread leads somewhere meaningful.
        </p>

        <div className="flex items-center justify-center gap-4 ">
          <PrimaryBtn onClick={() => navigate('/login')} className="">
            Enter my learning room
          </PrimaryBtn>
          <SecondaryBtn onClick={() => navigate('/register')} className='w-full'>
            Create an account
          </SecondaryBtn>
        </div>
      </motion.div>
    </main>
  )
}
