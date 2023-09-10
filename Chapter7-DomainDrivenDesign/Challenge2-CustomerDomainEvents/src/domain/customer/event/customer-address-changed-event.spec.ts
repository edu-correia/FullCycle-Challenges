import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import PrintOnConsoleLogWhenCustomerAddressIsChangedHandler from "./handler/print-on-console-log-when-customer-address-is-changed.handler";

describe("Customer address changed tests", () => {
  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new PrintOnConsoleLogWhenCustomerAddressIsChangedHandler();

    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
    ).toMatchObject(eventHandler);

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: "C1",
      name: "John Doe",
      address: "Street 1, Number 70, San Diego - CA"
    });

    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
