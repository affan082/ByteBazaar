import {NotificationInterface, NotificationItemInterface} from "../reducers/NotificationManager.tsx";



export interface NotificationTemplateInterface<T extends NotificationItemInterface>{
    notification: NotificationInterface,
    template?: T
}

function DefaultNotificationTemplate<T extends NotificationItemInterface>({notification, template}:NotificationTemplateInterface<T>) {
    return (
        template? <template key={notification.id} {...notification}/>: <DefaultNotificationTemplate notification={notification}/>
    );
}

export default DefaultNotificationTemplate;