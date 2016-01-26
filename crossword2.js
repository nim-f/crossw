'use strict';

var used = [],
    coords = [],
    cross = [];


document.getElementById("create_crossword").addEventListener("click", function( event )  {
    event.preventDefault;
    used = [];
    coords = [];
    cross = [];
    var cross_wrapper = document.getElementById("crossword_wrapper"),
        cross_div = document.getElementById("crossword"),
        used_div = document.getElementById("used"),
        unused_div = document.getElementById("unused"),
        size = 40;


    cross_div.innerHTML = '';
    used_div.innerHTML = '';
    unused_div.innerHTML = '';

    var words_temp = document.getElementById('words').value.toLowerCase();
    var words = words_temp.replace(/\s/g,'').split(',').sort(function(a, b){
        return b.length - a.length;
    });

    placeFirst(words);
    placeOthers(words);

    var unused = words.diff(used);
    var crossGrid = '';

    for (var x = 0; x < coords.length; x++) {
        crossGrid += '<div class="cell" style="width: '+ size +'px; height: '+ size +'px;line-height: '+ size*0.9 +'px; left: '+ coords[x][2]*size +'px; top: '+ coords[x][1]*size +'px;">'+coords[x][0]+'</div>'
    }

    cross_div.innerHTML += crossGrid;
    used_div.innerHTML += "Used words: " + used.join(', ');
    if (unused.length) {
        unused_div.style.display = 'block';
        unused_div.innerHTML += "Unused words: " + unused.join(', ');
    } else {
        unused_div.style.display = 'none';
    }

    var arrayX = [], arrayY = [];
    for (var i = 0; i < coords.length; i++) {
        arrayY.push(coords[i][1]);
        arrayX.push(coords[i][2]);

    }
    var maxX = Math.max.apply(Math,arrayX);
    var minX = Math.min.apply(Math,arrayX);
    var maxY = Math.max.apply(Math,arrayY);
    var minY = Math.min.apply(Math,arrayY);
    var crossWidth = maxX - minX + 1;
    var crossHeight = maxY - minY + 1;
    cross_wrapper.style.paddingLeft = Math.abs(minX*size) + 'px';
    cross_wrapper.style.paddingTop = Math.abs(minY*size) + 'px';
    cross_div.style.height = crossHeight*size + 2 + 'px';
    cross_div.style.width = crossWidth*size + 2 + 'px';

});



Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function checkWordCords (word, start, direction) {

    for (var n = 0; n <= word.length; n++ ) {
        if (direction) {
            var letterArr = [start[0], start[1]+n];
        } else {
            var letterArr = [start[0]+n, start[1]];
        }

        for (var i = 0; i < coords.length; i++) {
            var coordArr = coords[i].filter(function(number) {
                return !isNaN(number);
            });

            if (arraysEqual(coordArr, letterArr)  && word[n] != coords[i][0]) {
                return false;

            }
        }

    }
    return true;
}

function checkEmptySpace(x, y, direction) {
    var plusC, minusC,
        cc = [x,y];
    if (direction) {
        plusC = [x+1, y];
        minusC = [x-1,y];
    } else {
        plusC = [x, y+1];
        minusC = [x,y-1];
    }
    var counterPlus = 0;
    var counterMinus = 0;
    var counterCC = 0;

    for (var i = 0; i < coords.length; i++) {
        var coordArr = coords[i].filter(function (number) {
            return !isNaN(number);
        });
        if (arraysEqual(coordArr, plusC)) {
            counterPlus++;
        }
        if (arraysEqual(coordArr, minusC)) {
            counterMinus++;
        }
        if (arraysEqual(coordArr, cc)) {
            counterCC++;
        }
    }
    return counterPlus < 2 && counterMinus < 2 && counterCC < 2;
}

function placeFirst(words) {
    cross.push([words[0], true, []]);
    for (var n = 0; n < words[0].length; n++ ) {
        coords.push([words[0][n],0, n ]);
        cross[0][2].push([words[0][n],0, n ]);
    }
    used.push(words[0]);
}

function placeOthers(words) {
    for (var n = 1; n < words.length; n++ ) {
        loop:
            for (var c = 0; c < words[n].length; c++ ) {
                for (var s = 0; s < cross.length; s++) {
                    for (var r = 0; r < cross[s][2].length; r++) {
                        var direction = !cross[s][1];

                        var coordX, coordY;
                        if (direction) {
                            coordX = cross[s][2][r][1];
                            coordY = cross[s][2][r][2] - c;
                        } else {
                            coordX = cross[s][2][r][1] - c;
                            coordY = cross[s][2][r][2];
                        }
                        if (words[n][c] === cross[s][2][r][0]) {

                            var check = checkEmptySpace(cross[s][2][r][1], cross[s][2][r][2], !cross[s][1]) && checkWordCords(words[n], [coordX, coordY], direction);

                            if (check) {
                                cross.push([words[n], direction, []]);
                                for (var m = 0; m < words[n].length; m++) {
                                    if (direction) {
                                        coords.push([words[n][m], coordX, coordY + m]);
                                        cross[cross.length - 1][2].push([words[n][m], coordX, coordY + m]);
                                    } else {
                                        coords.push([words[n][m], coordX + m, coordY]);
                                        cross[cross.length - 1][2].push([words[n][m], coordX + m, coordY]);
                                    }
                                }
                                used.push(words[n]);
                                break loop;
                            }
                        }
                    }
                }
            }
    }
}


