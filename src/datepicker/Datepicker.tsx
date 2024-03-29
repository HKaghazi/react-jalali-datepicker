import moment, { Moment } from "moment-jalaali"
import React, { useEffect } from "react"
import { Board } from "../shared/board/Board"
import { Modal } from "../shared/modal/Modal"
import { Days } from "../views/days/Days"
import { Months } from "../views/months/Months"
import { SvgX } from "../icons/svg-x"

moment.loadPersian({ dialect: "persian-modern" })

import "./Datepicker.style.scss"

type DatepickerProps = {
  icon?: React.ReactNode
  placeholder?: string
  className?: string
  errorMessage?: string
  disabled?: boolean
  containerStyle?: string
  defaultValue?: moment.MomentInput
  value?: moment.MomentInput | undefined
  onChangeValue?: (value: Moment | undefined) => void
  showTime?: "onlyTime" | "onlyDate" | "both"
  clearable?: boolean
  clearButtonClassName?: string
  clearButtonSvgClassName?: string
}

export const Datepicker: React.FC<DatepickerProps> = (props) => {
  const {
    errorMessage,
    containerStyle,
    className,
    defaultValue,
    value,
    onChangeValue,
    clearable = false,
    disabled,
    showTime = "onlyDate",
    clearButtonClassName,
    clearButtonSvgClassName,
  } = props
  const [_value, setValue] = React.useState<moment.Moment | undefined>(defaultValue ? moment(defaultValue) : undefined)

  const dateTimeFormat = showTime == "both" ? "jYYYY/jMM/jDD HH:mm" : "jYYYY/jMM/jDD"
  // const [day, setDay] = React.useState("")
  // const [month, setMonth] = React.useState("")
  // const [year, setYear] = React.useState("")

  // const updateDate = (d: string, m: string, y: string) => {
  //   if (Number(d) && Number(m) && Number(y)) {
  //     setValue(moment(`${y}-${m}-${d}`, "jYYYY-jMM-jDD"))
  //   }
  // }

  // local variables
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [currentView, setCurrentView] = React.useState<"days" | "months" | "years">("days")

  // useEffect(() => {
  //   if (!onChangeValue) return
  //   onChangeValue(_value)
  // }, [_value])

  useEffect(() => {
    if (!value) {
      setValue(undefined)
    } else {
      if (moment(value).format(dateTimeFormat) != _value?.format(dateTimeFormat)) {
        setValue(moment(value))
      }
    }
  }, [value])

  const onUpdateValue = (newValue: moment.Moment | undefined) => {
    setValue(newValue)

    if (!onChangeValue) return
    onChangeValue(newValue)
    // setDay(String(newValue.jDate()))
    // setMonth(String(newValue.jMonth() + 1))
    // setYear(String(newValue.jYear()))
    // if (newValue.format(dateTimeFormat) == _value?.format(dateTimeFormat)) {
    //   setModalIsOpen(false)
    // }
  }

  //
  let view
  switch (currentView) {
    case "months":
      view = <Months currentValue={_value ?? moment()} switchView={(v) => setCurrentView(v)} updateValue={onUpdateValue} />
      break

    default:
      view = <Days showTime={showTime} currentValue={_value ?? moment()} dismissModal={() => setModalIsOpen(false)} updateValue={onUpdateValue} />
      break
  }

  return (
    <div className={`datepicker__wrapper ${containerStyle ?? ""}`}>
      <label className="datepicker__label" htmlFor="datapicker__input">
        {props.icon && <span className="inline-flex items-center px-1 flex-grow-0 select-none">{props.icon}</span>}
        <input
          className={`datapicker__input ${className ?? "bg-gray-100 py-2 px-3 rounded-lg w-full"} ` + (errorMessage ? "border-2 border-red-600 focus:outline-none " : "")}
          type="text"
          readOnly
          disabled={disabled}
          value={_value ? _value.format(dateTimeFormat) : ""}
          placeholder={props.placeholder}
          onClick={() => {
            if (!disabled) {
              setModalIsOpen(true)
            }
          }}
        />
        {clearable && (
          <button type="button" className={`datapicker__clearable ${clearButtonClassName}`} onClick={() => onUpdateValue(undefined)}>
            <SvgX style={{ width: 16, height: 16 }} className={clearButtonSvgClassName} />
          </button>
        )}
        {props.placeholder && <span className="datapicker__placeholder text-xs select-none">{props.placeholder}</span>}
      </label>

      {errorMessage && <small className="block text-xs text-red-600 select-none">{errorMessage}</small>}

      <Modal isOpen={modalIsOpen} onDismis={() => setModalIsOpen(false)}>
        <Board
          currentValue={_value ?? moment()}
          switchView={() => (currentView == "days" ? setCurrentView("months") : setCurrentView("days"))}
          updateValue={(newValue) => setValue(newValue)}
          showTime={showTime}
        />
        {view}
      </Modal>
    </div>
  )
}
