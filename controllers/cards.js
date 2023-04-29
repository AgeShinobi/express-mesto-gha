const Card = require('../models/card');

const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE
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

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      card.populate('owner');
      res
        .status(201)
        .send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.send({ data: card });
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.send({ data: card });
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

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
};
