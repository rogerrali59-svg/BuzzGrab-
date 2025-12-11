import * as FaIcons from "react-icons/fa";

export const iconMapping = {
  usersManagement: {
    registers: <FaIcons.FaUsers />,
  },
  finanicalManagement: {
    revenue: <FaIcons.FaMoneyBillWave />,
    transcation: <FaIcons.FaWallet />,
  },
  logger: {
    errorLogs: <FaIcons.FaExclamationTriangle />,
    emailQueue: <FaIcons.FaEnvelope />,
    LoginActivity: <FaIcons.FaHistory />,
  },
  Settings: {
    CMS: <FaIcons.FaEnvira />,
    Contactus: <FaIcons.FaPhoneAlt />,
    FAQ: <FaIcons.FaQuestion />,
    Smtp: <FaIcons.FaCloud />,
    Twillio: <FaIcons.FaTwitch />,
  },
};