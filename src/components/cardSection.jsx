import Card from "../components/card";

const cardData = [
  {
    heading: "Submit Ticket",
    data: "Submit Ticket",
    buttonName: "Submit Ticket",
    link: "/submitTicket",
  },
  {
    heading: "My Tickets",
    data: "View all Tickets that are created",
    buttonName: "My Tickets",
    link: "/myTickets",
  },
];

export default function CardSection() {
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-5 mt-10 border p-5 w-full">
        {cardData.map((card, index) => {
          return (
            <div key={index}>
              <Card
                heading={card.heading}
                data={card.data}
                buttonName={card.buttonName}
                link={card.link}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
