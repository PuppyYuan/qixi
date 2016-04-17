function BoyWalk() {

    var container = $('#content');
    var visualWidth = container.width();
    var visulaHeight = container.height();

    var swipe = Swipe($('#content'));

    var getValue = function (className) {
        var $elem = $('' + className);
        return {
            height: $elem.height(),
            top: $elem.position().top
        }
    };

    var pathY = function () {
        var data = getValue('.a_background_mid');
        return data.top + data.height / 2;
    } ();

    var $boy = $('#boy');
    var boyHeight = $boy.height();

    $boy.css({ top: pathY - boyHeight + 25 });

    function pauseWalk() {
        $boy.addClass('pauseWalk');
    }

    function restoreWalk() {
        $boy.removeClass('pauseWalk');
    }

    function slowWalk() {
        $boy.addClass('slowWalk');
    }

    function startRun(options, runTime) {
        var dfdPlay = $.Deferred();

        restoreWalk();
        $boy.transition(options, runTime, 'linear', function () {
            dfdPlay.resolve();
        });
        console.log("i am here")
        return dfdPlay;
    }

    function walkRun(time, dist, disY) {
        time = time || 3000;
        slowWalk();
        var d1 = startRun({
            'left': dist + 'px',
            'top': disY ? disY : undefined
        }, time);
        return d1;
    }

    function calculateDist(direction, propotion) {
        return (direction == 'x' ? visualWidth : visulaHeight) * propotion;
    }

    return {
        walkTo: function (time, propotionX, propotionY) { 
            var distX = calculateDist('x', propotionX);
            var distY = calculateDist('y', propotionY);
            
            return walkRun(time, distX, distY);
        },
        stopWalk: function () {
            pauseWalk();
        },
        setColor: function (value) {
            $boy.css('background-color', value);
        }
    };
}