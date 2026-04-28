export type Locale = 'vi' | 'en' | 'ja' | 'zh' | 'ko'

export const SUPPORTED_LOCALES: Locale[] = ['vi', 'en', 'ja', 'zh', 'ko']

export type Translations = {
  common: {
    back: string
    cancel: string
    save: string
    delete: string
    edit: string
    saved: string
    later: string
    awesome: string
  }
  profileSelect: {
    titlePart1: string
    titlePart2: string
    subtitle: string
    spinsBadge: string
    parentSettings: string
  }
  kidHome: {
    changeKid: string
    starsLabel: string
    checkin: string
    spin: string
    rewards: string
    history: string
  }
  checkin: {
    titleFor: string
    empty: string
    addInSettings: string
    spinUnit: string
    selected: string
    totalSpins: string
    confirm: string
    great: string
    youGet: string
    spinUnit2: string
    spinNow: string
  }
  spin: {
    title: string
    remainingSpins: string
    totalStars: string
    spinning: string
    tapToSpin: string
    noSpinsLeft: string
  }
  rewards: {
    title: string
    empty: string
    addInSettings: string
    needMoreStars: string
    redeemQuestion: string
    willDeductPrefix: string
    willDeductSuffix: string
    redeemNow: string
    congrats: string
    youRedeemedPrefix: string
  }
  history: {
    title: string
    empty: string
    deedsPrefix: string
    spinsEarned: string
    spinResult: string
    redeemPrefix: string
  }
  parent: {
    title: string
    tabs: { kids: string; deeds: string; rewards: string; settings: string }
    kids: {
      perKidStats: string
      addKid: string
      atLeastOne: string
      confirmDelete: string
      modalEdit: string
      modalAdd: string
      namePlaceholder: string
      totalStars: string
      pendingSpins: string
    }
    deeds: {
      spinUnit: string
      addDeed: string
      empty: string
      confirmDelete: string
      modalAdd: string
      modalEdit: string
      namePlaceholder: string
      spinCountLabel: string
    }
    rewards: {
      starsCost: string
      addReward: string
      empty: string
      confirmDelete: string
      modalAdd: string
      modalEdit: string
      namePlaceholder: string
      starCostLabel: string
    }
    settings: {
      starsPerSpinTitle: string
      starsMin: string
      starsMax: string
      pinTitle: string
      pinCurrent: string
      changePin: string
      languageTitle: string
      languageHint: string
      resetTitle: string
      resetHint: string
      resetButton: string
      resetConfirm: string
    }
  }
  pin: {
    enterPin: string
    defaultPin: string
    setNewPin: string
    confirmPin: string
    pinMismatch: string
  }
  avatar: {
    processing: string
    upload: string
    remove: string
    cannotReadImage: string
    canvasNotSupported: string
    cannotProcessImage: string
  }
  emoji: {
    star: string
    face: string
    people: string
    animal: string
    nature: string
    food: string
    activity: string
    travel: string
    object: string
    symbol: string
  }
  appTitle: string
  languages: {
    vi: string
    en: string
    ja: string
    zh: string
    ko: string
  }
  seed: {
    kid1: string
    kid2: string
    deed1: string
    deed2: string
    deed3: string
    deed4: string
    deed5: string
    reward1: string
    reward2: string
    reward3: string
  }
}
