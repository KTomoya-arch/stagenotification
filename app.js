"use strict";

import line from "@line/bot-sdk";
import fetch from "node-fetch";
const config = {
  channelSecret: "5ba5211d22979e22fca8781aaf689132",
  channelAccessToken:
    "M0ugNrqlznRCDeztwSZG+4Qiw2aMFQvhqc1sVq7tNRcFh4ahPmqJw9MxJ5OOBk7UI5rRguzDNBpiApb13SXDVf3ZzO+3UfjMwi4JwZOEepKLHKzdF1VH9J0oJ7lBsSn3J9ZFvbgLZx3qZJ/lBIyttwdB04t89/1O/w1cDnyilFU=",
};

const client = new line.Client(config);
let url = "https://spla2.yuu26.com/gachi/schedule";

const main = async () => {
  var res = fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  const stageLists = await res;
  const targetTimeHours = [21, 23, 1];
  let returnMessages = [];
  for (const stageList of stageLists.result) {
    const startTime = new Date(stageList.start);
    const test = startTime.getHours();
    if (stageList.rule === "ガチエリア" && targetTimeHours.includes(test)) {
      returnMessages.push(
        `開始時刻は${stageList.start.substring(11, 16)}。ステージは${
          stageList.maps
        } です。`
      );
    }
  }
  const messages = [];
  if (returnMessages.length === 0) {
    messages.push({
      type: "text",
      text: "本日、ガチエリアはありません。",
    });
  } else {
    messages.push({
      type: "text",
      text: "本日のガチエリア通知です。",
    });
    for (const returnMessage of returnMessages) {
      messages.push({
        type: "text",
        text: returnMessage,
      });
    }
  }

  try {
    const res = await client.broadcast(messages);
    console.log(res);
  } catch (error) {
    console.log(`エラー: ${error.statusMessage}`);
    console.log(error.originalError.response.data);
  }
};

main();
