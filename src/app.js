const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const validateProductId = (req, res, next) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid project id" });
  }

  next();
};

app.use("/repositories/:id", validateProductId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", validateProductId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(
    (repositorie) => repositorie.id == id
  );

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repositorie not found" });
  }

  const likes = repositories[repoIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repoIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(
    (repositorie) => repositorie.id == id
  );

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repositorie not found" });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  // const repoIndex = repositories.findIndex(
  //   (repositorie) => repositorie.id == id
  // );

  // if (repoIndex < 0) {
  //   return response.status(400).json({ error: "Repositorie not found" });
  // }

  repository.likes += 1;

  return response.status(200).json(repository);
});

module.exports = app;
