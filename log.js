module.exports.config = {
    name: "log",
    eventType: ["log:unsubscribe","log:subscribe","log:thread-name"],
    version: "1.0.0",
    credits: "Mirai Team",
    description: "Ghi lại thông báo các hoạt đông của bot!",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function({ api, event, Users, Threads }) {
    let data = (await Threads.getData(event.threadID)).data || {};
    if (data.log == false) return;
    const logger = require("../../utils/log");
    const moment = require("moment-timezone");
    var timenow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss | DD/MM/YYYY");
    const time = process.uptime() + global.config.UPTIME,
		  hours = Math.floor(time / (60 * 60)),
		  minutes = Math.floor((time % (60 * 60)) / 60),
		  seconds = Math.floor(time % 60);
    if (!global.configModule[this.config.name].enable) return;
let threadInfo = await api.getThreadInfo(event.threadID);
  let threadName = threadInfo.threadName;
  let sex = threadInfo.approvalMode;
  let threadMem = threadInfo.participantIDs.length;
  var pd = sex == false ? 'Tắt' : sex == true ? 'Bật' : '\n';
  var name = (await Users.getData(event.author)).name 
  const nameUser = global.data.userName.get(event.author) || await Users.getNameUser(event.author);
    var formReport =  "[ 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 𝗧𝗨̛̀ 𝗛𝗘̣̂ 𝗧𝗛𝗢̂́𝗡𝗚 ]" +
"\n━━━━━━━━━━━━━━━━━━━━\n→ 𝗧𝗲̂𝗻 𝗻𝗵𝗼́𝗺: " + threadName +
      "\n→ 𝗜𝗗 𝗻𝗵𝗼́𝗺: " + event.threadID +
      "\n→ 𝗧𝗼̂̉𝗻𝗴 𝘁𝗵𝗮̀𝗻𝗵 𝘃𝗶𝗲̂𝗻: " + threadMem +
      "\n→ 𝗣𝗵𝗲̂ 𝗱𝘂𝘆𝗲̣̂𝘁: " + pd +
      "\n━━━━━━━━━━━━━━━━━━━━\n→ 𝗡𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴: " + nameUser +
      "\n→ 𝗨𝗜𝗗: " + event.author +
      "\n→ 𝗛𝗮̀𝗻𝗵 𝗱𝗼̣̂𝗻𝗴: {task}" +
      "\n\n→ 𝗩𝗮̀𝗼 𝗟𝘂́𝗰: " + timenow +
      "\n━━━🌸 𝗦𝗘𝗩𝗘𝗥 𝗨𝗣𝗧𝗜𝗠𝗘 🌸━━━" +
      "\n→ 𝗧𝗼̂̉𝗻𝗴 𝗧𝗵𝗼̛̀𝗶 𝗚𝗶𝗮𝗻 𝗞𝗲̂́𝘁 𝗡𝗼̂́𝗶: " + "[ " + hours + " giờ " + minutes + " phút " + seconds + " giây ]" +
      "\n→ 𝗗𝗮𝘁𝗲 𝗡𝗼𝘄: " + Date.now() +" ",
        task = "";
    switch (event.logMessageType) {
     /*   case "log:thread-name": {
            const oldName = (await Threads.getData(event.threadID)).name || "Tên không tồn tại",
                  newName = event.logMessageData.name || "Tên không tồn tại";
            task = "Người dùng thay đổi tên nhóm từ: '" + oldName + "' thành '" + newName + "'";
            await Threads.setData(event.threadID, {name: newName});
            break;
        } */
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) task = "Người dùng đã thêm bot vào một nhóm mới!";
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId== api.getCurrentUserID()) task = "Người dùng đã kick bot ra khỏi nhóm!"
            break;
        }
        default: 
            break;
    }
    if (task.length == 0) return;
    formReport = formReport
    .replace(/\{task}/g, task);
    return api.sendMessage(formReport, global.config.ADMINBOT[0], (error, info) => {
        if (error) return logger(formReport, "[ Logging Event ]");
    });
}


