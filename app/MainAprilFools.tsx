import Link from '@/components/Link'
import { Poll } from './components/Poll'
import { AsciiArt } from './components/AsciiArt'
import { ChatBox } from './components/ChatBox'
import balance from 'public/static/images/cards/balance-card.png'
import feral from 'public/static/images/cards/feral-card.png'
import resto from 'public/static/images/cards/resto-card.png'
import guardian from 'public/static/images/cards/guardian-card.png'
import dungeons from 'public/static/images/cards/dungeons-card.png'
import raids from 'public/static/images/cards/raids-card.png'
import balanceGif from 'public/static/images/april/balance.webp'
import feralGif from 'public/static/images/april/feral.webp'
import restoGif from 'public/static/images/april/resto.webp'
import guardianGif from 'public/static/images/april/bear.webp'
import separator from 'public/static/images/april/separator.gif'
import usuhana from 'public/static/images/april/usuhana.gif'
import clouds from 'public/static/images/april/clouds.png'
import checks from 'public/static/images/april/checks.jpg'
import border from 'public/static/images/april/border.png'
import dot from 'public/static/images/april/dot.jpg'
import buttonBg from 'public/static/images/april/button_bg.png'
import pepe from 'public/static/images/april/pepe.gif'
import Image, { StaticImageData } from 'next/image'
import strawberry from 'public/static/images/april/badges/strawberry.gif'
import chillPill from 'public/static/images/april/badges/chill_pill.gif'
import button367 from 'public/static/images/april/badges/button367.png'
import button377 from 'public/static/images/april/badges/button377.gif'
import notepadpp from 'public/static/images/april/badges/notepadpp.gif'
import hanginthere from 'public/static/images/april/badges/hanginthere_softheartclinic.gif'
import lulu from 'public/static/images/april/badges/lulu.gif'
import button331 from 'public/static/images/april/badges/button331.gif'
import button262 from 'public/static/images/april/badges/button262.gif'
import notperfect from 'public/static/images/april/badges/notperfect.gif'
import catto from 'public/static/images/april/catto.gif'
import curtain from 'public/static/images/april/curtain.png'
import lace from 'public/static/images/april/lace.png'
import styles from './MainAprilFools.module.css'

const MarqueeText = ({ text }: { text: string }) => (
  <div
    className={styles.marqueeContainer}
    style={{
      backgroundImage: `url(${dot.src})`,
      backgroundRepeat: 'repeat',
    }}
  >
    <div className={styles.marqueeText}>
      {Array(3)
        .fill('★ ' + text + ' ★ ')
        .join(' ')}
    </div>
  </div>
)

const NavLink = ({ href, icon, text }: { href: string; icon: StaticImageData; text: string }) => (
  <Link href={href}>
    <div className={styles.navLink}>
      <div
        className={styles.navLinkContent}
        style={{
          backgroundImage: `url(${buttonBg.src})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '22px 22px',
        }}
      >
        <div className={styles.navIcon}>
          <Image src={icon} alt="" className="h-full w-full object-contain" />
        </div>
        <span className={styles.navText}>{text}</span>
      </div>
    </div>
  </Link>
)

const NavigationMenu = () => (
  <div className={styles.navigationMenu}>
    <div
      className={styles.navigationContent}
      style={{
        borderImage: `url(${border.src}) 7 fill round`,
      }}
    >
      <div className="mb-2 text-center">
        <h2 className={styles.navigationTitle}>✧ 𝓃𝒶𝓋𝒾ℊ𝒶𝓉𝒾ℴ𝓃 ✧</h2>
      </div>
      <div className={styles.navigationLinks}>
        <NavLink href="/blog/balance/compendium" icon={balanceGif} text="𝕓𝕒𝕝𝕒𝕟𝕔𝕖 𝕘𝕦𝕚𝕕𝕖" />
        <NavLink href="/blog/feral/compendium" icon={feralGif} text="𝕗𝕖𝕣𝕒𝕝 𝕘𝕦𝕚𝕕𝕖" />
        <NavLink href="/blog/resto/compendium" icon={restoGif} text="𝕣𝕖𝕤𝕥𝕠 𝕘𝕦𝕚𝕕𝕖" />
        <NavLink href="/blog/guardian/compendium" icon={guardianGif} text="𝕓𝕖𝕒𝕣 𝕘𝕦𝕚𝕕𝕖" />
      </div>
    </div>
  </div>
)

const Separator = () => (
  <div className="my-4 flex w-full flex-row items-center justify-around px-4">
    <Image
      src={usuhana}
      alt="Decorative flower"
      className="h-[35px] w-[35px] md:h-[50px] md:w-[50px]"
    />
    <Image
      src={separator}
      alt="Cute separator"
      className="h-auto w-full max-w-[300px] md:max-w-[600px]"
    />
    <Image
      src={usuhana}
      alt="Decorative flower"
      className="h-[35px] w-[35px] md:h-[50px] md:w-[50px]"
    />
  </div>
)

const AboutMeSection = () => (
  <div className="relative mx-auto h-full max-w-3xl">
    <div
      className="flex h-full flex-col justify-start overflow-y-scroll p-3 font-[auto] italic"
      style={{
        borderStyle: 'solid',
        borderWidth: '7px',
        borderImage: `url(${border.src}) 7 fill round`,
        backgroundColor: 'white',
        backgroundImage: `url(${buttonBg.src})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '22px 22px',
      }}
    >
      <h2 className="mb-3 self-center text-2xl font-bold text-[#FF7AAD]">𝒶𝒷ℴ𝓊𝓉 𝓂ℯ</h2>
      <p className="mb-3 justify-self-start text-sm">
        Welcome to the ultimate cozy Druid hideout! (✿◕‿◕){' '}
      </p>

      <p className="mb-3 justify-self-start text-sm">
        Whether you're a moon-blessed Balance caster, a claw-swinging Feral, a sturdy and unshakable
        Guardian, or a gentle yet powerful Resto healer, you've found your new home! Here, you'll
        discover lovingly crafted guides, tips, and secrets to help you become the best Druid you
        can be! From shapeshifting mastery to nature's deepest wisdom, we've got everything you need
        to thrive in harmony with the wild. Made with love, leaves, and a little bit of fae magic by
        the Druid community, for the Druid community! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Stay wild, stay wise, and may
        the moon guide your paws!
      </p>
      <p className="justify-self-start text-sm">
        Made with ♥ by the Druid community for the Druid community! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
      </p>
    </div>
  </div>
)

const WalkingCat = () => (
  <div className="relative h-[45px] w-full overflow-hidden">
    <div className={styles.walkingCat}>
      <Image src={catto} alt="Walking cat" className="h-[65px] w-auto" />
    </div>
  </div>
)

export default function HomeAprilFools() {
  const ENABLE_EXTRA_GUIDES = false

  const badges = [
    strawberry,
    chillPill,
    button367,
    button377,
    notepadpp,
    hanginthere,
    lulu,
    button331,
    button262,
    notperfect,
  ]

  const content = [
    { src: dungeons, href: '/dungeons', alt: '𝕕𝕦𝕟𝕘𝕖𝕠𝕟 𝕘𝕦𝕚𝕕𝕖𝕤', decorativeGif: balanceGif },
    { src: raids, href: '/raids', alt: '𝕣𝕒𝕚𝕕 𝕘𝕦𝕚𝕕𝕖𝕤', active: false, decorativeGif: guardianGif },
  ]

  const images = [
    {
      src: balance,
      href: '/blog/balance/compendium',
      alt: 'Balance guide',
      active: true,
      decorativeGif: balanceGif,
    },
    {
      src: feral,
      href: '/blog/feral/compendium',
      alt: 'Feral guide',
      active: true,
      decorativeGif: feralGif,
    },
    {
      src: resto,
      href: '/blog/resto/compendium',
      alt: 'Resto guide',
      active: true,
      decorativeGif: restoGif,
    },
    {
      src: guardian,
      href: '/blog/guardian/compendium',
      alt: 'Guardian guide',
      active: true,
      decorativeGif: guardianGif,
    },
  ]

  return (
    <div
      className="home min-h-screen w-full p-4 font-[auto]"
      style={{
        borderStyle: 'solid',
        borderWidth: '7px',
        borderImage: `url(${border.src}) 7 fill round`,
      }}
    >
      <div
        style={{
          backgroundImage: `url(${lace.src})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: '346px 113px',
          backgroundAttachment: 'fixed',
        }}
        className="absolute left-0 top-0 h-[30px] w-full"
      ></div>
      <div
        style={{
          backgroundImage: `url(${checks.src})`,
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
          borderStyle: 'solid',
          borderWidth: '2px',
          backgroundColor: 'white',
        }}
      >
        <MarqueeText text="✧･ﾟ Welcome to Dreamgrove! The cutest Druid site on the internet! ･ﾟ✧" />

        <WalkingCat />

        <div className="flex w-full flex-col justify-center gap-4 px-4 lg:h-[300px] lg:flex-row">
          <div className="lg:w-[220px]">
            <NavigationMenu />
          </div>
          <div className="flex-1">
            <ChatBox />
          </div>
        </div>

        <Separator />

        <div className="flex w-full flex-col justify-center gap-4 px-4 md:h-[300px] md:flex-row lg:h-[300px] ">
          <div className=" md:w-[400px] lg:w-[720px]">
            <AboutMeSection />
          </div>
          <div className="flex-1">
            <div
              className="relative flex h-full w-full flex-col items-center justify-center"
              style={{
                borderStyle: 'solid',
                borderWidth: '1px',
                backgroundColor: 'white',
                borderColor: 'black',
                backgroundImage: `url(${dot.src})`,
                backgroundRepeat: 'repeat',
              }}
            >
              <Image
                src={pepe}
                alt="Dancing Pepe"
                className="h-[100%] w-full object-contain md:h-[300px]"
              />
              <div className="absolute bottom-0 mt-2 h-[10%] text-xl font-bold text-[#FF7AAD] md:text-sm lg:text-lg">
                say hiii to my best friend uwu
              </div>
              <Image
                src={curtain}
                alt="left curtain"
                className="absolute left-0 top-0 h-full w-auto"
                style={{ objectFit: 'cover' }}
              />
              <Image
                src={curtain}
                alt="right curtain"
                className="absolute right-0 top-0 h-full w-auto scale-x-[-1]"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex w-full flex-col justify-center gap-4 px-4 lg:h-[330px] lg:flex-row">
          <div className="lg:w-[390px]">
            <Poll />
          </div>
          <div className="mb-8 flex-1 lg:mb-0">
            <AsciiArt />
          </div>
          <div className="flex-1">
            <div
              className="flex h-full flex-col px-3 py-2"
              style={{
                borderStyle: 'solid',
                borderWidth: '7px',
                borderImage: `url(${border.src}) 7 fill round`,
                backgroundColor: 'white',
              }}
            >
              <div className="mb-2 text-center">
                <h2 className={styles.pixelFont + ' mb-1 text-2xl font-bold text-[#FF7AAD]'}>
                  ✧ 𝓂ℴ𝓇ℯ ℊ𝓊𝒾𝒹ℯ𝓈 ✧
                </h2>
              </div>
              <div className="flex flex-1 flex-col justify-between">
                {content.map((image, index) => (
                  <NavLink
                    key={index}
                    href={image.href}
                    icon={image.decorativeGif}
                    text={image.alt}
                  />
                ))}
                <div className={styles.navLink}>
                  <div
                    className={styles.navLinkContent}
                    style={{
                      backgroundImage: `url(${buttonBg.src})`,
                      backgroundRepeat: 'repeat',
                      backgroundSize: '22px 22px',
                    }}
                  >
                    <span className={styles.navText}>𝕔𝕠𝕞𝕚𝕟𝕘 𝕤𝕠𝕠𝕟 ( ˘ ³˘)</span>
                  </div>
                </div>
                <div className={styles.navLink}>
                  <div
                    className={styles.navLinkContent}
                    style={{
                      backgroundImage: `url(${buttonBg.src})`,
                      backgroundRepeat: 'repeat',
                      backgroundSize: '22px 22px',
                    }}
                  >
                    <span className={styles.navText}> (˘³ ˘) 𝕔𝕞𝕚��𝕘 𝕤𝕠𝕠𝕟</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="mb-4 flex flex-col gap-4 px-4 md:h-[90px] md:flex-row">
          <div className="border border-black bg-white/80 p-4 text-center md:w-[300px]">
            <div className="mb-2 text-base font-bold text-[#FF7AAD]">✧ Visitor Counter ✧</div>
            <div className="font-mono text-lg" suppressHydrationWarning>
              {Math.floor(Math.random() * 1000000)
                .toString()
                .padStart(6, '0')}
            </div>
          </div>
          <div className="flex-1 overflow-hidden whitespace-nowrap border border-black bg-white/80 p-4">
            <div className={styles.marqueeText}>
              {Array(2)
                .fill(badges)
                .flat()
                .map((badge, index) => (
                  <Image
                    key={index}
                    src={badge}
                    alt="Decorative badge"
                    className="mx-2 inline-block h-[60px] w-auto"
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
