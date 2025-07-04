// ─────────────────────────────────────────────────────────────────────────────
// Core STACK‐API JS (modified collectData to honour data-seed)
// ─────────────────────────────────────────────────────────────────────────────

const timeOutHandler    = {};
const inputPrefix       = 'stackapi_input_';
const feedbackPrefix    = 'stackapi_fb_';
const validationPrefix  = 'stackapi_val_';
const apiurl            = '/stack-api';

const stackstring = {
  "teacheranswershow_mcq":"A correct answer is: {$a->display}",
  "api_which_typed":"which can be typed as follows",
  "api_valid_all_parts":"Please enter valid answers for all parts of the question.",
  "api_out_of":"out of",
  "api_marks_sub":"Marks for this submission",
  "api_submit":"Submit Answers",
  "generalfeedback":"General feedback",
  "score":"Score",
  "api_response":"Response summary",
  "api_correct":"Correct answers"
};

// ─── UPDATED collectData ─────────────────────────────────────────────────────
async function collectData(qfile, qname, qprefix) {
  let res = "";

  await getQuestionFile(qfile, qname).then((response) => {
    if (response.questionxml !== "<quiz>\nnull\n</quiz>") {
      // check if caller set a data-seed on the wrapping .que.stack
      const wrapper = document.querySelector(`#${qprefix}stack`)?.closest('.que.stack');
      const chosenSeed = (wrapper && wrapper.dataset.seed)
                         ? wrapper.dataset.seed
                         : response.seed;

      res = {
        questionDefinition: response.questionxml,
        answers:              collectAnswer(qprefix),
        seed:                 chosenSeed,
        renderInputs:         qprefix + inputPrefix,
        readOnly:             false
      };
    }
  });

  return res;
}
// ─────────────────────────────────────────────────────────────────────────────

// Get answer values from inputs, textareas, selects
function collectAnswer(qprefix) {
  let res = {};
  res = processNodes(res, document.getElementsByTagName('input'),    qprefix);
  res = processNodes(res, document.getElementsByTagName('textarea'), qprefix);
  res = processNodes(res, document.getElementsByTagName('select'),   qprefix);
  return res;
}

function processNodes(res, nodes, qprefix) {
  for (let el of nodes) {
    if (el.name.startsWith(qprefix + inputPrefix) && !el.name.includes('_val')) {
      const key = el.name.slice((qprefix + inputPrefix).length);
      if (el.type === 'checkbox' || el.type === 'radio') {
        if (el.checked) res[key] = el.value;
      } else {
        res[key] = el.value;
      }
    }
  }
  return res;
}

// … All other functions (send, validate, answer, stackSetup, etc.) remain UNCHANGED.
// (They’re exactly as in your original file.)

// ─────────────────────────────────────────────────────────────────────────────
// At the very end of this file:
function createQuestionBlocks() {
  // … your existing createQuestionBlocks implementation …
}

function addCollapsibles() {
  // … your existing addCollapsibles implementation …
}

function stackSetup() {
  createQuestionBlocks();
  addCollapsibles();
}
