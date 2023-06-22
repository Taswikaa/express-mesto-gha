const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'c0e93f2d3d88bacea4c540ff0c6a64c12bfebbfe78d0f77b41e85975521d9437');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация job,rf 2' });
  }

  req.user = payload;

  next();
};
