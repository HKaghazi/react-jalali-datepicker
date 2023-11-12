import moment, { Moment } from "jalali-moment"
import React from "react"
import { ArrowLeftCMP, ArrowRightCMP } from "../icons/Icons"
import "./Board.scss"

moment.locale("fa")

type BoardProps = {
  currentValue: Moment
  showTime?: "onlyTime" | "onlyDate" | "both"
  switchView?: () => void
  updateValue: (newValue: Moment) => void
}

export const Board: React.FC<BoardProps> = ({ currentValue, showTime = "onlyDate", switchView, updateValue }) => {
  const goAMonthAhead = () => {
    updateValue(currentValue.add(1, "jMonth").clone())
  }

  const returnAMonthBack = () => {
    updateValue(currentValue.subtract(1, "jMonth").clone())
  }

  return (
    <div className="rjd__board-container">
      <div>
        {(showTime == "both" || showTime == "onlyDate") && (
          <button type="button" className="rjd__go-back" onClick={goAMonthAhead}>
            <ArrowRightCMP width={32} height={32} />
          </button>
        )}
      </div>

      <main className="rjd__board-text" onClick={switchView}>
        <span>{currentValue.format(showTime == "both" ? "jD MMMM jYYYY HH:mm" : showTime == "onlyTime" ? "HH:mm" : "jD MMMM jYYYY")}</span>
      </main>

      <div>
        {(showTime == "both" || showTime == "onlyDate") && (
          <button type="button" className="rjd__go-forward" onClick={returnAMonthBack}>
            <ArrowLeftCMP width={32} height={32} />
          </button>
        )}
      </div>
    </div>
  )
}
