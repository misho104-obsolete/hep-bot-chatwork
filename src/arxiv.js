var INSPIRE_BIB_URL = function(arxivId){ return 'http://inspirehep.net/search?of=hx&em=B&p=find%20eprint%20' + arxivId;};
var ARXIV_PDF_URL   = function(arxivId){ return 'http://arxiv.org/pdf/' + arxivId; };
var ARXIV_QUERY_URL = function(arxivId){ return 'http://export.arxiv.org/api/query?id_list=' + arxivId; };


function saveArxivFileToDropbox(config, arxivId, directory){
    checkArxivId(arxivId); // always throw for suspicious events
    if(directory.substr(-1,1) != '/'){ directory += '/'; }

    var url = ARXIV_PDF_URL(arxivId);
    var filename = directory + arxivId + '-' + getAuthorNames(arxivId) + '.pdf';
    saveWebFilesToDropbox(config, url, filename);

    var biburl = INSPIRE_BIB_URL(arxivId);
    var bibfilename = directory + 'bib/' + arxivId + '.txt';
    saveWebFilesToDropbox(config, biburl, bibfilename);
}


function checkArxivId(arxivId){
    if(!(arxivId.match(/^\d{4}\.\d{4,5}$/) || arxivId.match(/^[\w-.]\/\d{7}/))){
        throw new Error('Invalid arXiv id.');
    }
}


function getAuthorNames(arxivId) {
    checkArxivId(arxivId);
    var atom = XmlService.getNamespace('http://www.w3.org/2005/Atom');

    var url = ARXIV_QUERY_URL(arxivId);
    var xml = UrlFetchApp.fetch(url).getContentText();
    var root = XmlService.parse(xml).getRootElement();

    var authors = root.getChild('entry', atom).getChildren('author', atom);
    var names = authors.map(function(author){
        var name = author.getChild('name', atom).getText();
        return name.replace(/collaboration/i, '').replace(/^\s+|\s+$/g, '').replace(/.* /g, '').replace(/-/g, '');
    });
    var maxAuthors = 5;
    if(names.length == 0){ return 'noauthor'; }
    if(names.length > maxAuthors){ names[maxAuthors-1] = 'etal'; }

    var namesString = names[0];
    var n = (names.length > maxAuthors ? maxAuthors : names.length);
    for (var i = 1; i < n; i++) {
        namesString = namesString + '-' + names[i];
    }
    return namesString;
}
