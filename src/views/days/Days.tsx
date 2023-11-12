import React, { useState, useEffect } from "react"
import { Moment } from "jalali-moment"
import { DaysHead } from "../../shared/daysHead/DaysHead"
import { DayItem } from "../../shared/dayItem/DayItem"
import { Hours } from "../hours/Hours"

import "./Days.scss"

type DaysProps = {
  currentValue: Moment
  updateValue: (newValue: Moment) => void
  dismissModal: () => void
  showTime: "onlyTime" | "onlyDate" | "both"
}

interface IdaysInMonth {
  date: string
  numDay: number
  dayInWeek: number
  isSelected: boolean
  selectable: boolean
}

export const Days: React.FC<DaysProps> = ({ currentValue, showTime, updateValue, dismissModal }) => {
  const [daysInMonth, setDaysInMonth] = useState<IdaysInMonth[]>([])

  useEffect(() => {
    currentValue.locale("fa")

    setDaysInMonth([...daysBeforeThisMonth(currentValue), ...daysThisMonth(currentValue), ...daysAfterThisMonth(currentValue)])
  }, [currentValue])

  return (
    <div className="rjd__days-container">
      <div className="rjd_days-main-wrapper">
        <div className="rjd_days-wrapper">
          <DaysHead />

          <div className="rjd_days-inner-wrapper">
            {daysInMonth.map((dayData, idx) => (
              <DayItem key={idx} updateValue={updateValue} {...dayData} />
            ))}
          </div>
        </div>

        {(showTime == "both" || showTime == "onlyTime") && <Hours currentValue={currentValue} updateValue={updateValue} showOkButton={false} />}
      </div>

      <button type="button" className="rjd__btn-return" onClick={dismissModal}>
        تایید
      </button>
    </div>
  )
}

const daysBeforeThisMonth = (currentValue: Moment) => {
  const daysInMonth = []
  const clonedDate = currentValue.clone()
  let firstDayOFMonth = clonedDate.startOf("jMonth").set("hour", currentValue.get("hour")).set("minute", currentValue.get("minute"))
  const weekOfFirstDayOFMonth = clonedDate.startOf("jMonth").weekday()

  for (let dayIdx = 0; dayIdx < weekOfFirstDayOFMonth; dayIdx++) {
    firstDayOFMonth.subtract(6 - dayIdx, "jDay")
    daysInMonth.push({
      date: firstDayOFMonth.toISOString(),
      numDay: Number(firstDayOFMonth.format("jDD")),
      dayInWeek: firstDayOFMonth.weekday(),
      isSelected: firstDayOFMonth.diff(currentValue, "d") == 0,
      selectable: false,
    })
    firstDayOFMonth = currentValue.clone().startOf("jMonth").set("hour", currentValue.get("hour")).set("minute", currentValue.get("minute"))
  }

  return daysInMonth
}

const daysThisMonth = (currentValue: Moment) => {
  const daysInMonth = []
  const clonedDate = currentValue.clone()
  const firstDayOFMonth = clonedDate.startOf("jMonth").set("hour", currentValue.get("hour")).set("minute", currentValue.get("minute"))
  const firstDayCloned = firstDayOFMonth.clone()
  for (let dayIdx = 1; dayIdx <= clonedDate.jDaysInMonth(); dayIdx++) {
    daysInMonth.push({
      date: firstDayCloned.toISOString(),
      numDay: Number(firstDayCloned.format("jDD")),
      dayInWeek: firstDayCloned.weekday(),
      isSelected: firstDayCloned.isSame(currentValue, "day"),
      selectable: true,
    })
    firstDayCloned.add(1, "d")
  }

  return daysInMonth
}

const daysAfterThisMonth = (currentValue: Moment) => {
  const daysInMonth = []
  const clonedDate = currentValue.clone()
  let lastDayOFMonth = clonedDate.endOf("jMonth").set("hour", currentValue.get("hour")).set("minute", currentValue.get("minute"))
  const weekOfLastDayOFMonth = clonedDate.endOf("jMonth").weekday()

  for (let dayIdx = 1; dayIdx <= 6 - weekOfLastDayOFMonth; dayIdx++) {
    lastDayOFMonth.add(dayIdx, "jDay")
    daysInMonth.push({
      date: lastDayOFMonth.toISOString(),
      numDay: Number(lastDayOFMonth.format("jDD")),
      dayInWeek: lastDayOFMonth.weekday(),
      isSelected: lastDayOFMonth.diff(currentValue, "d") == 0,
      selectable: false,
    })

    lastDayOFMonth = currentValue.clone().endOf("jMonth").set("hour", currentValue.get("hour")).set("minute", currentValue.get("minute"))
  }

  return daysInMonth
}
