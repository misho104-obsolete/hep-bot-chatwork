var DROPBOX_SAVE_URL_API = 'https://api.dropboxapi.com/2/files/save_url';

function saveWebFilesToDropbox(config, fileUrl, filename) {
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + config.dropbox_token,
    };
    var parameters = {
        'url': fileUrl,
        'path': filename,
    };
    var options = {
        'method': 'POST',
        'headers': headers,
        'payload': JSON.stringify(parameters)
    };
    var response = JSON.parse(UrlFetchApp.fetch(DROPBOX_SAVE_URL_API, options).getContentText());

    var checkUrl = DROPBOX_SAVE_URL_API + '/check_job_status';
    var checkOptions = {
        'method': 'POST',
        'headers': headers,
        'payload': JSON.stringify({ 'async_job_id': response.async_job_id })
    };

    do {
        Utilities.sleep(1000);
        response = JSON.parse(UrlFetchApp.fetch(checkUrl, checkOptions).getContentText());
    } while (response['.tag'] != 'complete');

    Logger.log('File uploaded successfully to Dropbox');
}
