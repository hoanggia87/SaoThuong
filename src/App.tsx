import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ProfileSelect } from './screens/ProfileSelect'
import { KidHome } from './screens/KidHome'
import { DailyCheckin } from './screens/DailyCheckin'
import { Spin } from './screens/Spin'
import { Rewards } from './screens/Rewards'
import { History } from './screens/History'
import { ParentSettings } from './screens/ParentSettings'
import { useT } from './i18n'

type Screen =
  | { name: 'profileSelect' }
  | { name: 'kidHome'; kidId: string }
  | { name: 'checkin'; kidId: string }
  | { name: 'spin'; kidId: string }
  | { name: 'rewards'; kidId: string }
  | { name: 'history'; kidId: string }
  | { name: 'parent' }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'profileSelect' })
  const { dict, locale } = useT()

  useEffect(() => {
    document.title = dict.appTitle
    document.documentElement.lang = locale
  }, [dict.appTitle, locale])

  return (
    <div className="min-h-full h-full w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen.name + ('kidId' in screen ? screen.kidId : '')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="min-h-full h-full w-full"
        >
          {screen.name === 'profileSelect' && (
            <ProfileSelect
              onPickKid={(kidId) => setScreen({ name: 'kidHome', kidId })}
              onOpenParent={() => setScreen({ name: 'parent' })}
            />
          )}
          {screen.name === 'kidHome' && (
            <KidHome
              kidId={screen.kidId}
              onBack={() => setScreen({ name: 'profileSelect' })}
              onCheckin={() => setScreen({ name: 'checkin', kidId: screen.kidId })}
              onSpin={() => setScreen({ name: 'spin', kidId: screen.kidId })}
              onRewards={() => setScreen({ name: 'rewards', kidId: screen.kidId })}
              onHistory={() => setScreen({ name: 'history', kidId: screen.kidId })}
            />
          )}
          {screen.name === 'checkin' && (
            <DailyCheckin
              kidId={screen.kidId}
              onBack={() => setScreen({ name: 'kidHome', kidId: screen.kidId })}
              onGoSpin={() => setScreen({ name: 'spin', kidId: screen.kidId })}
            />
          )}
          {screen.name === 'spin' && (
            <Spin
              kidId={screen.kidId}
              onBack={() => setScreen({ name: 'kidHome', kidId: screen.kidId })}
            />
          )}
          {screen.name === 'rewards' && (
            <Rewards
              kidId={screen.kidId}
              onBack={() => setScreen({ name: 'kidHome', kidId: screen.kidId })}
            />
          )}
          {screen.name === 'history' && (
            <History
              kidId={screen.kidId}
              onBack={() => setScreen({ name: 'kidHome', kidId: screen.kidId })}
            />
          )}
          {screen.name === 'parent' && (
            <ParentSettings onBack={() => setScreen({ name: 'profileSelect' })} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
