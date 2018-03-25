var maxcol = -1;

var defaultcols = ['#1361e7', '#717696', '#fde813', '#88ccbc', '#125d58', '#ff010c'];

function default_colour(n) {
    if (n < defaultcols.length)
        return defaultcols[n];
    else
        return getRandomColor();
}

// https://stackoverflow.com/questions/1484506/random-color-generator#1484514
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

$('#go').click(function(e) {
    e.preventDefault();

    reset();

    var data = $('#data').val();
    var w = parseInt($('#width').val());
    var h = parseInt($('#height').val());
    var ncols = parseInt($('#ncols').val());
    var nbricks = parseInt($('#nbricks').val());

    if (w < 0 || h < 0) {
        $('#messages').text("Width and height must both be positive.");
        return;
    }

    if (ncols < 2) {
        $('#messages').text('Must have at least 2 colours');
        return;
    }

    if (data.length == 0) {
        $('#messages').text("Please enter at least one character for the data.");
        return;
    }

    if (w*h < data.length * nbricks) {
        $('#messages').text("Dimensions are too small to fit the given input data.");
        return;
    }

    // convert the data into a base-N representation
    var colour = new Array();
    for (var i = 0; i < data.length; i++) {
        var byteval = data.charCodeAt(i);
        var baseN = new Array();

        while (byteval > 0) {
            baseN.unshift(byteval % ncols);
            byteval /= ncols;
            byteval = Math.floor(byteval);
        }

        if (baseN.length > nbricks) {
            $('#messages').text("Can't encode the given data. Increase number of colours, bricks per character, or both.");
            return;
        }

        while (baseN.length < nbricks) {
            baseN.unshift(0);
        }

        colour = colour.concat(baseN);
    }

    // count how many of each brick we need
    var need = new Array();
    for (var i = 0; i < ncols; i++) {
        need.push(0);
    }

    // convert the base-N representation into html
    $('#generated-art').css('overflow', 'auto');
    $('#generated-art').css('width', w*11);
    $('#generated-art').css('line-height', 0);
    $('#generated-art').css('border', '24px solid transparent');
    $('#generated-art').css('border-image','url(radix6.png) 24 stretch');
    var html = ''
    for (var i = 0; i < w*h; i++) {
        need[colour[i % colour.length]]++;
        col = $('#col' + colour[i % colour.length]).val();

        html += "<img style=\"background-color:" + col + "\" src=\"brick.png\">";
    }
    $('#generated-art').html(html);

    // generate some text explaining the colour counts
    var colhtml = 'Bricks used: ';
    for (var i = 0; i < ncols; i++) {
        colhtml += need[i] + "<img style=\"background-color:" + $('#col' + i).val() + "\" src=\"brick.png\">&nbsp;&nbsp;&nbsp;";
    }
    $('#messages').html(colhtml);
});

$('#ncols').keyup(function(e) {
    var ncols = parseInt($('#ncols').val());

    if (ncols < 2) {
        $('#messages').text('Must have at least 2 colours');
        return;
    }

    for (var c = maxcol+1; c < ncols; c++) {
        $('#colour-selectors').append("<span id=\"spancol" + c + "\">" + c + " <input id=\"col" + c + "\" type=\"color\" value=\"" + default_colour(c) + "\"></span>");
        $('#col' + c).on('change', function() { $('#go').click(); });
    }

    if (maxcol < ncols-1)
        maxcol = ncols-1;

    for (var c = 0; c < ncols; c++) {
        $('#spancol' + c).show();
    }

    for (var c = ncols; c <= maxcol; c++) {
        $('#spancol' + c).hide();
    }

    $('#go').click();
});

$('#shuffle').click(function(e) {
    e.preventDefault();

    var ncols = parseInt($('#ncols').val());

    var colours = new Array();
    for (var i = 0; i < ncols; i++) {
        colours.push($('#col' + i).val());
    }

    shuffle(colours);

    for (var i = 0; i < ncols; i++) {
        $('#col' + i).val(colours[i]);
    }

    $('#go').click();
});

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

$('#data').keyup(function() { $('#go').click(); });
$('#nbricks').keyup(function() { $('#go').click(); });
$('#width').keyup(function() { $('#go').click(); });
$('#height').keyup(function() { $('#go').click(); });

function reset() {
    $('#messages').text('');
    $('#generated-art').text('');
    $('#generated-art').css('border','none');
}

$('#ncols').keyup();
$('#go').click();
