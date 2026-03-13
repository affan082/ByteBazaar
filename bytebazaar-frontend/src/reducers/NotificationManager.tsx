import {Bounce, toast} from "react-toastify";

export interface NotificationItemInterface {
    _id: string | number;
    [key: string]: any;
}

export interface NotificationInterface<T extends NotificationItemInterface>{
    id: string;
    type: 'success' | 'error' | 'info' | 'default';
    heading: string;
    message?: string;
    buttonText?: string;
    buttonUrl?: string;
    template?: T;
    options?: any
}

export const defaultToastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
}

export function showNotification<T extends NotificationItemInterface>(n:NotificationInterface<T>){
    switch(n.type){
        case 'success':
            toast.success(<template key={n.id} {...n}/>, n.options || defaultToastOptions);
            break;
        default:
            toast.success(<template key={n.id} {...n}/>, n.options || defaultToastOptions);
            break;
    }
}