import { useState, useEffect } from "react";
import { wait } from "../shared";

export const useTypedMessage = (message) => {
    
    const [typedMessage, setTypedMessage] = useState('');

    useEffect(() => {
        setTypedMessage('');

        if (message.length) {
            (async () => {
                let visibleMessage = '';

                for (let i = 0; i < message.length; i++) {
                    await wait(50);
                    visibleMessage = visibleMessage + message[i];
                    setTypedMessage(visibleMessage);
                }
            })();
        }
    }, [message]);

    return typedMessage
};