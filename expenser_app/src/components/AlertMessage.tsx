import type { MessageType } from "../types/common";

type props = {
    message: MessageType
}

let alertType: Record<string,string> = {
    0: 'danger',
    1: 'success'
}

const AlertMessage = ({message}: props) => {
    return (
         <div className={`alert alert-${alertType[message.type]} mt-3`} role="alert">
             <b>{message.text}</b>
        </div>
    )
}

export default AlertMessage;