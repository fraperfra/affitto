import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center md:justify-start md:relative min-h-[60px]">

        {/* Logo: centrato con flex su mobile, assoluto su desktop */}
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <Link href="/">
            <Image
              src="/images/Logo Diba Nero.png"
              alt="Immobiliare Diba"
              width={160}
              height={56}
              className="object-contain h-12 md:h-10 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Nav sinistra — solo desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#appartamenti" className="font-sans text-xs text-text-secondary hover:text-anthracite tracking-wider uppercase transition-colors">Appartamenti</Link>
        </nav>

        {/* Nav destra — solo desktop */}
        <nav className="hidden md:flex items-center gap-6 ml-auto">
          <Link href="#contratto" className="font-sans text-xs text-text-secondary hover:text-anthracite tracking-wider uppercase transition-colors">Contratto</Link>
          <Link href="#candidatura" className="font-sans text-xs bg-gold hover:bg-gold/90 text-white px-4 py-2 rounded-full tracking-wider uppercase transition-colors text-[10px] font-medium">Candidati</Link>
        </nav>

      </div>
    </header>
  )
}
