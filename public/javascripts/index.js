$(function() {
  console.log("loaded");

  var userData = $('div.users').data('users');


  $('input.typeahead').typeahead({
    hint: true,
    minLength: 1
    },{
    name: 'users',
    source: substringMatcher(userData)
    });

  $('.td-time').each(function() {
    console.log(this)
    
    
});

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

function onSelect(){
  var name = "";
  name = $('input.typeahead.tt-input')[0].value;
  console.log("You selected " + name); 
  window.location = window.location + "user/" + name;
}

function formatTime(t) {
  let w = Math.floor(t/100)
  let ms = Math.floor(((t/100) - w) * 100)
  let s = Math.floor(t/100 % 60)
  let m = Math.floor((t/(100*60)) % 60)
  let h = Math.floor((t/(100*60*60)) % 24)
  let fTime = ""
  if (h > 0 ) {
      fTime += String(h).padStart(2, '0') + ":"
  }
  if (m > 0) {
      fTime += String(m).padStart(2, '0') + ":"
  }
  fTime += String(s).padStart(2, '0') + "."
  fTime += String(ms).padStart(2, '0')
  return fTime
}