const Card = require('../models/card');

const {
  STATUS_CREATED,
} = require('../config');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => {
      res.send({ deletedCard: card });
    })
    .catch(next);
};
// общая логика likeCard и dislikeCard
const cardLikeUpdate = (req, res, method, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    method,
    { new: true },
  )
    .orFail()
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const likeCard = (req, res, next) => {
  const method = { $addToSet: { likes: req.user._id } };
  cardLikeUpdate(req, res, method, next);
};

const dislikeCard = (req, res, next) => {
  const method = { $pull: { likes: req.user._id } };
  cardLikeUpdate(req, res, method, next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
