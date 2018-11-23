// import Google api library
var { google } = require("googleapis");
// import the Google drive module
var drive = google.drive("v3");
// import key
var key = require("./privatekey.json");

// import path require directories calls & fs file system
var path = require("path");
var fs = require("fs");

/*pedido para recuperar uma autorização que permita trabalhar com o serviço da web do Google Drive*/

// recuperar nova instancia de autorização JWT (Token)
var jwToken = new google.auth.JWT(
  //Uso do privatekey.json (link client_email) essencial para a vizualização do usuario no google drive
  key.client_email,
  null,
  key.private_key,
  ["https://www.googleapis.com/auth/drive"],
  null
);
jwToken.authorize(authErr => {
  if (authErr) {
    console.log("error : " + authErr);
    return;
  } else {
    console.log("Autorizado");
  }
});
//////////////////////////////////////////
// lista de arquivos
//necessario a chave do folder do google drive
var folder = "1UmSb-P3G9mEVeJ0iPxUlWfVNyb5KJ8RN";
drive.files.list(
  {
    auth: jwToken,
    pageSize: 10,
    q: "'" + folder + "' in parents and trashed=false",
    fields: "files(id, name)"
  },
  (err, { data }) => {
    if (err) return console.log("API retorna error: " + err);
    const files = data.files;
    if (files.length) {
      console.log("Files:");
      files.map(file => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log("Arquivos não encontrado.");
    }
  }
);

////////////////////////////////////////////////////////////////////////////
// upload de arquivo no folder
var folderId = "1UmSb-P3G9mEVeJ0iPxUlWfVNyb5KJ8RN";
var fileMetadata = {
  'name': 'text.txt',
  folder: [folderId]
};
var media = {
  mimeType: 'text/plain',
  body: fs.createReadStream(path.join(__dirname, './text.txt'))
};
drive.files.create({
  auth: jwToken,
  resource: fileMetadata,
  media: media,
  fields: 'id'
}, function(err, file) {
  if (err) {
    // error
    console.error(err);
  } else {
    console.log('File Id: ', file.id);
  }
});
