// ========================= ASCII鑹烘湳 =========================
function initAscii(container) {
  const arts = [
    { art: '      /\\_/\\\n     ( o.o )\n      > ^ <\n     Meow ~ Have a great day!', quote: 'Code changes the world. Your line today could be tomorrow\'s miracle.' },
    { art: '      / \\__\n     (    @\\___\n     /         O\n    /   (_____/\n   /_____/   U\n    Woof ~ What a wonderful day!', quote: 'Every bug is a chance to grow. Don\'t fear mistakes.' },
    { art: '      (\\_/)\n      ( \u2022_\u2022)\n      / > \ud83e\udd55\n    Little bunny loves carrots~', quote: 'Improve 1% daily, in a year you\'ll be 37.8x better!' },
    { art: '      ,___,\n      [O.o]\n      /)__)\n      -\"--\"-\n    Night owls need sleep too!', quote: 'Great programmers fix fast, not never err.' },
    { art: '       \u2665\u2665\u2665\u2665\u2665\u2665\u2665\u2665\n      \u2665         \u2665\n     \u2665   LOVE   \u2665\n      \u2665         \u2665\n       \u2665\u2665\u2665\u2665\u2665\u2665\u2665\u2665\n    Code with heart, ship with love!', quote: 'Elegant code is a joy to behold.' },
    { art: '         /\\\n        /  \\\n       /    \\\n      /______\\\n      |      |\n      |  \ud83d\ude80  |\n      |      |\n     /|  GO  |\\\n    /_|______|_\\\n    To the stars and beyond!', quote: 'Instead of wishing on a star, become one yourself.' },
    { art: '        ^^^\n       ^^^^^\n      ^^^^^^^\n     ^^^^^^^^^\n        |||\n        |||\n    May your code grow like a tree!', quote: 'A bit more effort today = a bit more luck tomorrow.' },
    { art: '     ><((((\'><\n     ><((((\'><\n     ><((((\'><\n    Swim smoothly like a fish!', quote: 'Programming is a way of solving problems.' },
    { art: '         ( (\n          ) )\n       ........\n       |      |]\n       \\      /\n        `----\'\n    Coffee first, coding second!', quote: 'Today\'s sweat = tomorrow\'s success. Keep going!' },
    { art: '          *\n         ***\n        *****\n       *******\n        *****\n         ***\n          *\n    You are the brightest star!', quote: 'Life = Git. Every step counts, every commit matters.' }
  ];

  let idx = Math.floor(Math.random() * arts.length);

  function renderArt() {
    const a = arts[idx];
    let html = '<div style="text-align: center;">';
    html += '<div class="ascii-display">' + a.art + '</div>';
    html += '<div class="ascii-quote"><span class="quote-text">\ud83d\udcaa ' + a.quote + '</span></div>';
    html += '<div class="ascii-nav">';
    html += '<button class="btn" onclick="asciiPrev()">\u2b05 Prev</button>';
    html += '<span style="padding:6px 12px;color:var(--text-dim);font-size:0.85rem;">' + (idx+1) + '/' + arts.length + '</span>';
    html += '<button class="btn" onclick="asciiNext()">Next \u27a1</button>';
    html += '</div></div>';
    container.innerHTML = html;
    window.asciiPrev = () => { idx = (idx - 1 + arts.length) % arts.length; renderArt(); };
    window.asciiNext = () => { idx = (idx + 1) % arts.length; renderArt(); };
  }
  renderArt();
}