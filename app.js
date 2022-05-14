"use strict";

import line from "@line/bot-sdk";
import fetch from "node-fetch";
import express from "express";

var app = express();
const config = {
  channelSecret: "5ba5211d22979e22fca8781aaf689132",
  channelAccessToken:
    "M0ugNrqlznRCDeztwSZG+4Qiw2aMFQvhqc1sVq7tNRcFh4ahPmqJw9MxJ5OOBk7UI5rRguzDNBpiApb13SXDVf3ZzO+3UfjMwi4JwZOEepKLHKzdF1VH9J0oJ7lBsSn3J9ZFvbgLZx3qZJ/lBIyttwdB04t89/1O/w1cDnyilFU=",
};

const client = new line.Client(config);
let url = "https://spla2.yuu26.com/gachi/schedule";

app.get("/", (req, res) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const stageLists = data;
      const targetTimeHours = [21, 23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
      let returnMessages = [];
      for (const stageList of stageLists.result) {
        const startTime = new Date(stageList.start);
        const test = startTime.getHours();
        if (stageList.rule === "ガチエリア" && targetTimeHours.includes(test)) {
          returnMessages.push(
            `${stageList.start.substring(5, 7)}月${stageList.start.substring(
              8,
              10
            )}日、開始時刻は${stageList.start.substring(11, 16)}。ステージは${
              stageList.maps
            } です。`
          );
        }
      }
      let messages = [];
      if (returnMessages.length === 0) {
        messages.push({
          type: "text",
          text: "24時間以内にガチエリアはありません。",
        });
      } else {
        messages.push({
          type: "text",
          text: "24時間以内のガチエリア情報です。",
        });
        for (const returnMessage of returnMessages) {
          messages.push({
            type: "text",
            text: returnMessage,
          });
        }
      }
      try {
        const res = client.broadcast(messages);
        console.log(res);
      } catch (error) {
        console.log(`エラー: ${error.statusMessage}`);
        console.log(error.originalError.response.data);
      }
    });
});

app.listen(8080, function () {
  console.log("8080番ポートで起動しました。");
});
