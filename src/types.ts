export type Kid = {
  id: string
  name: string
  avatar: string
  totalStars: number
  pendingSpins: number
}

export type Deed = {
  id: string
  name: string
  icon: string
  spinCount: number
}

export type Reward = {
  id: string
  name: string
  icon: string
  starCost: number
}

export type LogEntry =
  | {
      id: string
      kidId: string
      ts: number
      type: 'checkin'
      deeds: { deedId: string; name: string; spinCount: number }[]
      totalSpins: number
    }
  | {
      id: string
      kidId: string
      ts: number
      type: 'spin'
      stars: number
    }
  | {
      id: string
      kidId: string
      ts: number
      type: 'redeem'
      rewardId: string
      rewardName: string
      starCost: number
    }

export type Settings = {
  parentPin: string
  minStars: number
  maxStars: number
}
