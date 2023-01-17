import axios from "axios";
import { useEffect, useState } from "react";
import Card from "./Card";
import NewCardForm from "./NewCardForm";

const CardsList = (props) => {
  const [cardsData, setCardsData] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/boards/${props.board.id}/cards`
      )
      .then((response) => {
        setCardsData(response.data);
        console.log("API is working!!!!", response.data);
      })
      .catch((error) => {
        console.log(
          "API broken :(. no 2xx status code",
          error.response.data.status
        );
        console.log("Response to broken api", error.response.data);
      });
  }, [props.board]);


  const plusOneCardItem = (card) => {
    console.log(cardsData)
    axios.patch(`${process.env.REACT_APP_BACKEND_URL}/cards/${card.card_id}/like`).then((response) =>{
      const newCardsData = cardsData.map((currentCard) => {
        return currentCard.card_id !== card.card_id ? currentCard : {...card, like_count : card.like_count + 1}
      });
      setCardsData(newCardsData);
    }).catch((error) => {
      console.log('Error:', error)
      alert('Couldn\'t +1 the card.');
    });
  };

  const createNewCard = (cardFormData) => {
    // add board.id back later
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/boards/${props.board.id}/cards`,
        cardFormData
      )
      .then((response) => {
        console.log("New Card successfully created", response.data.card);
        const cards = [...cardsData];
        cards.push(response.data.card);
        setCardsData(cards);
      })
      .catch((error) => {
        console.log("Error", error);
        alert("Couldn't create a new card.");
      });
  };


  const cardElements = cardsData.map((card) => {
    return (
    <Card
      card={card}
      plusOneCardItem={plusOneCardItem}
      // deleteCardItem={deleteCardItem}
    />)
  });

  return (
    <section>
    <h2>Cards for {props.board.title}</h2>
      <div>
        {cardElements}
      </div>
      <section>
        <NewCardForm createNewCard={createNewCard}></NewCardForm>
        <span onClick={NewCardForm}></span>
      </section>
    </section>
  );
};

export default CardsList;
