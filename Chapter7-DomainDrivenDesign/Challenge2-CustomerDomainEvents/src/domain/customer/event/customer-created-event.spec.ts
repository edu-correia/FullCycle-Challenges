import EventDispatcher from "../../@shared/event/event-dispatcher";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import CustomerCreatedEvent from "./customer-created.event";
import PrintOnConsoleLog1WhenCustomerIsCreatedHandler from "./handler/print-on-console-log-1-when-customer-is-created.handler";
import PrintOnConsoleLog2WhenCustomerIsCreatedHandler from "./handler/print-on-console-log-2-when-customer-is-created.handler";

describe("Customer created event tests", () => {
  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new PrintOnConsoleLog1WhenCustomerIsCreatedHandler();
    const eventHandler2 = new PrintOnConsoleLog2WhenCustomerIsCreatedHandler();

    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);

    const customerCreatedEvent = new CustomerCreatedEvent(null);

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });
});
