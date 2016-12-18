var polynom;
var p, p1;
var n;
var lc;
var d;
var integral;
var a = -50;
var b = 50;
var roots = [];
var roots_exp = [];
var move = 0.25;
var canvas;
var ctx;

$(document).ready(function () {
    init_canvas();
})

$("#start").click(function () {
    run();
})

$("#input1").keydown(function (e) {
    if (e.which == '13') {
        run();
    }
})

function run() {
    Polynomial.setField("Q");

    polynom = $("#input1").val();
    p = new Polynomial(polynom);
    p1 = new Polynomial(polynom);

    $("#output1").html(katex.renderToString(p.toString()));

    n = p.degree();
    $("#output2").html(n);

    lc = new Polynomial(polynom).lc();
    $("#output3").html(katex.renderToString(lc.toString()));

    d = new Polynomial(polynom).derive(1);
    $("#output4").append(katex.renderToString("P'(x) = ") + " " + katex.renderToString(d.toString()));

    integral = new Polynomial(polynom).integrate(1);
    $("#output5").html(katex.renderToString("\\int P(x) \\mathrm{d}x = ") + " " + katex.renderToString(integral.toLatex() + " + c"));

    find_roots(p);

    factorization(roots, roots_exp);

    draw_graphic();

}

function find_roots(p) {
    for (var i = a; i <= b; i++) {
        result = p.result(i);
        if (result == '0') {
            if (i > 0) {
                p = p.div("x-" + i);
                find_roots(p);
            } else {
                j = -parseInt(i);
                p = p.div("x+" + j);
                find_roots(p);
            }
            if (roots.indexOf(i) < 0) {
                roots.push(i);
                roots_exp.push("1");
            } else {
                var x = parseInt(roots_exp[roots.indexOf(i)]);
                x++;
                roots_exp[roots.indexOf(i)] = x;
            }
            break;
        }
    }
    if (roots.length < 1) {
        $("#output6").html("Polinom nema nula u skupu Z");
    } else {
        $("#output6").html(katex.renderToString(roots.toString()));
    }
}

function factorization(roots, roots_exp) {
    fact_string = "";
    var degree = 0;
    for (i = 0; i < roots.length; i++) {
        if (roots[i] == '0') {
            if (roots_exp[i] == 1) {
                fact_string = fact_string + "x";
                degree++;
            } else {
                fact_string = fact_string + "x^" + roots_exp[i];
                degree += parseInt(roots_exp[i]);
            }
        }
        if (roots[i] > 0) {
            if (roots_exp[i] == 1) {
                fact_string = fact_string + "(x - " + roots[i] + ")";
                degree++;
            } else {
                fact_string = fact_string + "(x - " + roots[i] + ")^" + roots_exp[i];
                degree += parseInt(roots_exp[i]);
            }
        } else if (roots[i] < 0) {
            if (roots_exp[i] == '1') {
                fact_string = fact_string + "(x + " + Math.abs(parseInt(roots[i])) + ")";
                degree++;
            } else {
                fact_string = fact_string + "(x + " + Math.abs(parseInt(roots[i])) + ")^" + roots_exp[i];
                degree += parseInt(roots_exp[i]);
            }
        }
    }

    if (degree == n) {
        $("#output7").html(katex.renderToString(fact_string));
    } else {
        $("#output7").html("Polinom se ne može potpuno rastaviti u skupu Z");
    }

}

function init_canvas() {
    //inicijalizovanje canvas elementa
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    //visina i sirina canvas elementa i brisanje ako je nesto nacrtano
    canvas.height = $("#canvas_wrapper").width();
    canvas.width = $("#canvas_wrapper").width();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //x-osa
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#dddddd";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    //strelica na x-osi
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height / 2);
    ctx.lineTo(canvas.width - 10, canvas.height / 2 - 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height / 2);
    ctx.lineTo(canvas.width - 10, canvas.height / 2 + 10);
    ctx.stroke();

    //y-osa
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#dddddd";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.width);
    ctx.stroke();

    //strelica na y-osi
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2 - 10, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2 + 10, 10);
    ctx.stroke();

    //podeoci na x-osi
    for (i = -10; i < 10; i += 1) {
        draw_dot(i, 0, "#bbbbbb");
        ctx.font = "16px Arial";
        ctx.fillText(i, x_coord(i - 0.3), y_coord(-0.5));
    }

    //podeoci na y-osi
    for (i = -10; i < 10; i += 1) {
        draw_dot(0, i, "#bbbbbb");
        if (i != 0) {
            ctx.font = "16px Arial";
            ctx.fillText(i, x_coord(-0.5), y_coord(i));
        }
    }
}

var dot_width = 2;

function x_coord(x) {
    return canvas.width / 2 + 50 * x;
}

function y_coord(y) {
    return canvas.height / 2 - 50 * y;
}

function draw_dot(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x_coord(x) - dot_width / 2, y_coord(y) - dot_width / 2, dot_width, dot_width);
}

function draw_graphic() {
    for (i = -7; i < 7; i += move) {
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.moveTo(x_coord(i), y_coord(p1.result(i)));
        ctx.lineTo(x_coord(i + move), y_coord(p1.result(i + move)));
        ctx.stroke();
    }
}

$("#reset").click(function () {
    $("#input1").val("");
    for (i = 1; i < 8; i++) {
        $("#output" + i).html("");
    }
    roots = [];
    roots_exp = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    init_canvas();
})

$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
});

$(document).scroll(function () {
    var y = $(this).scrollTop();
    if (y > 250) {
        $(".header-input").css("position", "fixed");
        $(".header-input").css("top", "0");
        $("header").css("height", "330px");
    } else {
        $(".header-input").css("position", "relative");
        $("header").css("height", "250px");
    }
})