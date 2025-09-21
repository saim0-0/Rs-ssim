const axios = require('axios');


const baseApiUrl = async () => {

  const base = await axios.get(`https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`);

  return base.data.api;

};


module.exports.config = {

  name: "baby",

  version: "7.0.0",

  credits: "dipto",

  cooldowns: 0,

  hasPermssion: 0,

  description: "better than all sim simi",

  commandCategory: "chat",

  category: "chat",

  usePrefix: true,

  prefix: true,

  usages: `[anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2]...\nteach react [YourMessage] - [react1], [react2]...\nremove [YourMessage]\nrm [YourMessage] - [indexNumber]\nmsg [YourMessage]\nlist OR list all\nedit [YourMessage] - [NewMessage]`,

};


module.exports.run = async function ({ api, event, args, Users }) {

  try {

    const link = `${await baseApiUrl()}/baby`;

    const dipto = args.join(" ").toLowerCase();

    const uid = event.senderID;


    if (!args[0]) {

      const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];

      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);

    }


    // REMOVE

    if (args[0] === 'remove') {

      const fina = dipto.replace("remove ", "");

      const respons = await axios.get(`${link}?remove=${encodeURIComponent(fina)}&senderID=${uid}`);

      return api.sendMessage(respons.data.message, event.threadID, event.messageID);

    }


    // REMOVE by index

    if (args[0] === 'rm' && dipto.includes('-')) {

      const [fi, f] = dipto.replace("rm ", "").split(' - ');

      const respons = await axios.get(`${link}?remove=${encodeURIComponent(fi)}&index=${f}`);

      return api.sendMessage(respons.data.message, event.threadID, event.messageID);

    }


    // LIST

    if (args[0] === 'list') {

      if (args[1] === 'all') {

        const res = await axios.get(`${link}?list=all`);

        const data = res.data.teacher.teacherList || [];

        const teachers = await Promise.all(data.map(async (item) => {

          const number = Object.keys(item)[0];

          const value = item[number];

          const name = await Users.getName(number) || "unknown";

          return { name, value };

        }));

        teachers.sort((a, b) => b.value - a.value);

        const output = teachers.map((teacher, index) => `${index + 1}/ ${teacher.name}: ${teacher.value}`).join('\n');

        return api.sendMessage(`Total Teach = ${data.length}\n\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);

      } else {

        const respo = await axios.get(`${link}?list=all`);

        const data = respo.data.teacher.teacherList || [];

        return api.sendMessage(`Total Teach = ${data.length}`, event.threadID, event.messageID);

      }

    }


    // MESSAGE

    if (args[0] === 'msg' || args[0] === 'message') {

      const fuk = dipto.replace(/^(msg|message) /, "");

      const respo = await axios.get(`${link}?list=${encodeURIComponent(fuk)}`);

      return api.sendMessage(`Message ${fuk} = ${respo.data.data}`, event.threadID, event.messageID);

    }


    // EDIT

    if (args[0] === 'edit') {

      const [oldMsg, newMsg] = dipto.replace("edit ", "").split(' - ');

      if (!oldMsg || !newMsg) {

        return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);

      }

      const res = await axios.get(`${link}?edit=${encodeURIComponent(oldMsg)}&replace=${encodeURIComponent(newMsg)}`);

      return api.sendMessage(`✅ Changed: ${res.data.message}`, event.threadID, event.messageID);

    }


    // TEACH normal

    if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {

      const [comd, command] = dipto.split(' - ');

      const final = comd.replace("teach ", "");

      if (!command || command.length < 2) {

        return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2]...', event.threadID, event.messageID);

      }

      const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&reply=${encodeURIComponent(command)}&senderID=${uid}`);

      const name = await Users.getName(re.data.teacher) || "unknown";

      return api.sendMessage(`✅ Replies added: ${re.data.message}\nTeacher: ${name}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);

    }


    // TEACH intro

    if (args[0] === 'teach' && args[1] === 'amar') {

      const [comd, command] = dipto.split(' - ');

      const final = comd.replace("teach ", "");

      if (!command || command.length < 2) {

        return api.sendMessage('❌ | Invalid format! Use teach amar [YourMessage] - [Reply]', event.threadID, event.messageID);

      }

      const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&senderID=${uid}&reply=${encodeURIComponent(command)}&key=intro`);

      return api.sendMessage(`✅ Replies added ${re.data.message}`, event.threadID, event.messageID);

    }


    // TEA
