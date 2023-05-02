const Card = require('../models/card');

const {
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
} = require('../config');

const getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((e) => {
      if (e.message === 'ValidationError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: DEFAULT_ERROR_MESSAGE });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.send({ deletedCard: card });
    })
    .catch((e) => {
      if (e.message === 'Not found') {
        res
          .status(STATUS_NOT_FOUND)
          .send({ message: 'Карточка не найдена' });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: DEFAULT_ERROR_MESSAGE });
      }
    });
};
// общая логика likeCard и dislikeCard
const cardLikeUpdate = (req, res, method) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    method,
    { new: true },
  )
    .orFail(() => { throw new Error('ValidationError'); })
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e.message === 'ValidationError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: DEFAULT_ERROR_MESSAGE });
      }
    });
};

const likeCard = (req, res) => {
  const method = { $addToSet: { likes: req.user._id } };
  cardLikeUpdate(req, res, method);
};

const dislikeCard = (req, res) => {
  const method = { $pull: { likes: req.user._id } };
  cardLikeUpdate(req, res, method);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
