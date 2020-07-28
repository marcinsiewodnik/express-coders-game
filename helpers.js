exports.respondWithError = (res, error) => {

    res.status(400);
    res.json({ error });
}

exports.respondeNotFound = (res) => {

    res.status(404);
    res.send("Not found");
}

exports.respondInternalError = (err, res) => {

    res.status(500);
    res.send("We have encountered an error and we were notified about it. We'll try to fix it as soon as possible!")
}