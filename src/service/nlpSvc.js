const { dockStart } = require("@nlpjs/basic");

const Nlpbot = async (userInput) => {
  try {
    const dock = await dockStart("./nlpFiles/conf.json");
    const manager = dock.get("nlp");
    // use the command to train the bot by filling up the content in training.json
    // model should be created in ./nlpFiles/model.nlp
    // await manager.train("./nlpFiles/model.nlp");
    // await manager.save("./nlpFiles/model.nlp");

    await manager.load("./nlpFiles/model.nlp");

    const result = await manager.process("en", userInput);
    return result;
  } catch (error) {
    console.log("from nlpmanager ", error);
    return error;
  }
};

module.exports = { Nlpbot };
