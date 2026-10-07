'use client'

import React from 'react'

export interface HealthGoal {
  id: string
  label: string
  icon: string
  tagMatch: string[]
}

export const HEALTH_GOALS: HealthGoal[] = [
  { id: 'all', label: 'All Needs', icon: '✨', tagMatch: [] },
  { id: 'brain', label: 'Brain & Memory', icon: '🧠', tagMatch: ['mamra', 'almonds', 'walnuts', 'kashmir'] },
  { id: 'protein', label: 'Gym & High Protein', icon: '💪', tagMatch: ['almonds', 'cashews', 'seeds', 'makhana', 'snacking'] },
  { id: 'heart', label: 'Heart & Cholesterol', icon: '🫀', tagMatch: ['walnuts', 'chia', 'omega-3', 'seeds', 'fibre'] },
  { id: 'skin', label: 'Glowing Skin & Saffron', icon: '🌸', tagMatch: ['saffron', 'mongra', 'badam', 'raisins', 'superfood'] },
  { id: 'snack', label: 'Healthy Tea Snacks', icon: '☕', tagMatch: ['roasted', 'salted', 'makhana', 'anjeer', 'figs'] },
  { id: 'gifting', label: 'Luxury Gifting Sets', icon: '🎁', tagMatch: ['gift', 'diwali', 'premium', 'wooden-box'] },
]

interface HealthGoalFilterProps {
  activeGoal: string
  onSelectGoal: (goalId: string) => void
}

export default function HealthGoalFilter({
  activeGoal,
  onSelectGoal,
}: HealthGoalFilterProps) {
  return (
    <div className="mb-6 bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#704B32] flex items-center gap-1.5">
          <span>🎯</span>
          <span>Shop by Health &amp; Lifestyle Goal:</span>
        </span>
        <span className="text-[10px] text-stone-500 font-medium">1-Click Filter</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {HEALTH_GOALS.map((goal) => {
          const isActive = activeGoal === goal.id
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onSelectGoal(goal.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#17233B] text-white shadow-xs ring-1 ring-[#17233B]'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              <span>{goal.icon}</span>
              <span>{goal.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
