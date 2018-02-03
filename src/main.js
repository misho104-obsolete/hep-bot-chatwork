function doPost(e) {
    var json = JSON.parse(e.postData.contents);
    var config = CONFIG[json.webhook_setting_id];
    chatworkVerifySignature(config, e); // should throw if failed

    // postChatwork(config, json.webhook_event.room_id, "hogehoge");
    // SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('log').getRange(col, row).setValue(content);
    return ContentService.createTextOutput('done');
}
