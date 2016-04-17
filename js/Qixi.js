var lamp = {
    elem: $('.b_background'),
    bright: function () {
        this.elem.addClass('lamp-bright');
    },
    dark: function () {
        this.elem.removeClass('lamp-bright');
    }
}

function doorAction(left, right, time) {
    var $door = $('.door');
    var doorLeft = $('.door-left');
    var doorRight = $('.door-right');
    var defer = $.Deferred();
    var count = 2;

    var complete = function () {
        if (count == 1) {
            defer.resolve();
            return;
        }
        count--;
    };

    doorLeft.transition({
        'left': left
    }, time, complete);

    doorRight.transition({
        'left': right
    }, time, complete);
    return defer;
}

// 开门
function openDoor() {
    return doorAction('-50%', '100%', 2000);
}

// 关门
function shutDoor() {
    return doorAction('0%', '50%', 2000);
}

var instanceX;

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

    function walkToShop(runTime) {
        var defer = $.Deferred();
        var doorObj = $('.door');
        var offsetDoor = doorObj.offset();
        var doorOffsetLeft = offsetDoor.left;

        var offsetBoy = $boy.offset();
        var boyOffsetLeft = offsetBoy.left;

        instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffsetLeft + $boy.width() / 2);
        
        var walkPlay = startRun({
            transform: 'translateX(' + instanceX + 'px), scale(0.3, 0.3)',
            opacity: 0.1
        }, 2000);

        walkPlay.done(function () {
            $boy.css({ opacity: 0 });
            defer.resolve();
        });

        return defer;
    }

    function walkOutShop(runTime) {
        var defer = $.Deferred();
        restoreWalk();
        //开始走路
        var walkPlay = startRun({
            transform: 'translateX(' + instanceX + 'px),scale(1,1)',
            opacity: 1
        }, runTime);
        //走路完毕
        walkPlay.done(function () {
            defer.resolve();
        });
        return defer;
    }
    
    function takeFlower(){
        var defer = $.Deferred();
        setTimeout(function() {
            $boy.addClass('slowFlowerWalk');
            defer.resolve();
        }, 100);
        return defer;
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
        },
        toShop: function () {
            return walkToShop.apply(null, arguments);
        },
        outShop: function () {
            return walkOutShop.apply(null, arguments);
        },
        takeFlower: function(){
            return takeFlower();
        },
        resetOriginal: function(){
            this.stopWalk();
            $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
        },
        setFlowerWalk: function(){
            $boy.addClass('slowFlowerWalk');
        },
        getWidth: function(){
            return $boy.width();
        },
        rotate: function(callback){
            restoreWalk();
            $boy.addClass('boy-rotate');
            if(callback){
                $boy.on('animationend', function(){
                    callback();
                    $(this).off();
                });
            }
        }
    };
}