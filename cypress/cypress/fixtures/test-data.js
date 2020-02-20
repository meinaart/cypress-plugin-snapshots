const dataRaw = {
  json: {
    'undefined': undefined,
    'null': null,
    'false': false,
    'true': true,
    'string': 'kylie',
    'number': 5,
    'date': new Date(2019, 1, 11),
    'array': [1, 'string', false, null, /* new Date(2019, 1, 11), */ { b: 2, a: 1, e: undefined }, undefined, 11 ],
    'object': {
      false: false,
      string: 'string',
      null: null,
      undefined: undefined,
      array: ['string', 5, true, null, { b: 2, a: 1, e: undefined }, undefined ],
      // date: new Date(2019, 1, 11),
      nested: {
        array: [2, 'string', true, null, undefined, /* new Date(2019, 1, 11), */ { b: 2, a: 1 } ],
        true: true,
        number: 1,
        undefined: undefined
      }
    }
  },
  html: {
    'jquery-get': '',
    'jquery-create': Cypress.$('<div>Created DIV</div>'),
    'cy-get-element': '',
    'DOM-exists': '',
    'DOM-created': '',
    'HTMLCollection': '',
    'NodeList': '',
    'svg': ''
  }
};

const dataFormatted = {
  json: dataRaw.json,
  html: {
    'jquery-get': '<h4>H1</h4><h4>H2</h4><h4>H3</h4>',
    'jquery-create': '<div>Created DIV</div>',
    'cy-get-element': '<h4>H1</h4><h4>H2</h4><h4>H3</h4>',
    'DOM-exists': '<div id="test-div">Test Div</div>',
    'DOM-created': '<div>DOM-created</div>',
    'HTMLCollection': '<h4>H1</h4><h4>H2</h4><h4>H3</h4>',
    'NodeList': '<h4>H1</h4><h4>H2</h4><h4>H3</h4>',
    'svg': '<svg height="20" width="40"><path d="M10 0 L0 20 L20 20 Z"></path></svg>'
  }
};

let document, win;
before(function () {
  cy.visit('/static/stub3.html');
  cy.window().then((win2) => {
    win = win2;
    document = win2.document;

    dataRaw.html['jquery-get'] = Cypress.$(win.document).find('h4');
    dataRaw.html['DOM-exists'] = document.getElementById('test-div');
    dataRaw.html['HTMLCollection'] = document.getElementsByTagName('h4');
    dataRaw.html['NodeList'] = document.querySelectorAll("h4");
    dataRaw.html['svg'] = Cypress.$(win.document).find('svg');

    dataRaw.html['DOM-created'] = document.createElement("div");
    var node = document.createTextNode("DOM-created");
    dataRaw.html['DOM-created'].appendChild(node);

    cy.get('h4').then(function ($el) {
      dataRaw.html['cy-get-element'] = $el;
    });
  });
});

function runSuite(suiteName, cb, skip) {
  describe(suiteName, function () {
    Object.keys(dataRaw[suiteName]).forEach(function (item) {
      if (skip && skip.includes(item)) {
        it.skip(item, function () { });
      } else {
        it(item, function () {
          cb(dataRaw[suiteName][item], item, suiteName);
        });
      }
    });
  });
}

function runSuites(testName, cb, skip) {
  describe(testName, function () {
    Object.keys(dataRaw).forEach(function (suiteName) {
      runSuite(suiteName, cb, skip);
    });
  });
}

module.exports = {
  dataRaw,
  dataFormatted,
  runSuite,
  runSuites
}
