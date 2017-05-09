
var app = function() {

    var self = {};
    self.is_configured = false;

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) {
        var k=0;
        v.map(function(e) {e._idx = k++;});
    };

    // Initializes an attribute of an array of objects.
    var set_array_attribute = function (v, attr, x) {
        v.map(function (e) {e[attr] = x;});
    };

    self.initialize = function () {
        document.addEventListener('deviceready', self.ondeviceready, false);
    };

    self.ondeviceready = function () {
        // This callback is called once Cordova has finished
        // its own initialization.
        console.log("The device is ready");
        $("#vue-div").show(); // This is jQuery.
        self.is_configured = true;
    };

    self.reset = function () {
        self.vue.board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    };

    self.shuffle = function(i, j) {
        // You need to implement this.

        console.log("Shuffle:" + i + ", " + j);
    };

    self.scramble = function() {
        // Read the Wikipedia article.  If you just randomize,
        // the resulting puzzle may not be solvable.
        console.log("self.vue.board=" + self.vue.board);
        var randomArr = randomPerm(self.vue.board);
        if (!isSolvable(randomArr)){
            console.log("trying again");
            self.scramble();
        }
        else{
            self.vue.board = randomArr;

        }

    };

    self.setRed = function (el) {
        return (el === 1) || (el === 3) || (el === 6) || (el === 8) ||
            (el === 9) || (el === 11) || (el === 14);
    };

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            board: []
        },
        methods: {
            reset: self.reset,
            shuffle: self.shuffle,
            scramble: self.scramble,
            setRed: self.setRed
        }

    });

    self.reset();

    return self;
};
function randomPerm(array) {
    console.log("array = :" + array);
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        Vue.set(array, currentIndex, array[randomIndex]);
        Vue.set(array, randomIndex, temporaryValue);
    }

    return array;
}
function isSolvable(puzzle) {
    var parity = 0;
    var gridWidth = Math.sqrt(puzzle.length);
    var row = 0; // the current row we are on
    var blankRow = 0; // the row with the blank tile

    for (var i = 0; i < puzzle.length; i++)
    {
        if (i % gridWidth === 0) { // advance to next row
            row++;
        }
        if (puzzle[i] === 0) { // the blank tile
            blankRow = row; // save the row on which encountered
            continue;
        }
        for (var j = i + 1; j < puzzle.length; j++)
        {
            if (puzzle[i] > puzzle[j] && puzzle[j] !== 0)
            {
                parity++;
            }
        }
    }

    if (gridWidth % 2 === 0) { // even grid
        if (blankRow % 2 === 0) { // blank on odd row; counting from bottom
            return parity % 2 === 0;
        } else { // blank on even row; counting from bottom
            return parity % 2 !== 0;
        }
    } else { // odd grid
        return parity % 2 === 0;
    }
}

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){
    APP = app();
    APP.initialize();
});
