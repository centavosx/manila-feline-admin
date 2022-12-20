import CalendarComponent, { CalendarProps } from 'react-calendar'
import styled from '@emotion/styled'

export const Calendar = styled(CalendarComponent)`
  && {
    padding: 5px;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    border-width: 1px;
    button {
      color: black;
    }
    span {
      font-weight: 600;
      font-size: 18px;
    }
    .react-calendar__month-view__weekdays__weekday {
      abbr {
        text-decoration: none;
        font-size: 16px;
        color: black;
      }
    }
    .react-calendar__tile--now {
      background-color: #b4a79e;
    }
    .react-calendar__tile--active:enabled:hover,
    .react-calendar__tile--active:enabled:focus {
      background-color: #3f352c;
      color: white;
    }
    .react-calendar__tile--active {
      background-color: #3f352c;
      color: white;
    }
    .react-calendar__tile {
      padding: 25px;
      font-size: 16px;
      font-weight: 400;
    }
    button:disabled {
      color: grey;
    }
    @media screen and (max-width: 900px) {
      .react-calendar__tile {
        padding: 15px;
        padding-top: 25px;
        padding-bottom: 25px;
      }
    }
    @media screen and (max-width: 540px) {
      span {
        font-weight: 600;
        font-size: 14px;
      }
      .react-calendar__tile {
        padding: 10px;
        padding-top: 28px;
        padding-bottom: 28px;
      }
      .react-calendar__month-view__weekdays__weekday {
        abbr {
          text-decoration: none;
          font-size: 12px;
        }
      }
    }
  }
`
