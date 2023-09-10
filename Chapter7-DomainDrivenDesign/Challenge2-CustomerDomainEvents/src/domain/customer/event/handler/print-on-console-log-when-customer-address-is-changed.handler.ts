import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class PrintOnConsoleLogWhenCustomerAddressIsChangedHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    const { id, name, address } = event.eventData;
    console.log(`Customer address: ${id}, ${name} changed to ${address}`); 
  }
}
