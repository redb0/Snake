/**
 * Created by Владимир on 11.09.2017.
 */

/**
 * Исходный объект.
 *
 * @type {{px: number, a: number, color: string}}
 * px - Размер стороны квадрата в пикселях
 * a - Количество квадратов на игровом поле
 * color - Цвет игрового поля
 */
var el = {
    px: 0,
    a: 20,
    color: "#333333"
};

/**
 * Объект "Змея".
 * Прототипно унаследован от простейшего объекта el.
 * @type {{x: number, y: number, dx: number, dy: number, cord: [], len: number, color: string, scope: number, __proto__: {px: number, a: number, color: string}, moving: snake.moving}}
 * x - Координата головы змеи по оси x
 * y - Координата головы змеи по оси y
 * dx - Изменение координаты x, отвечает за передвижение
 * dy - Изменение координаты y, отвечает за передвижение
 * cord - Массив координат вида (x; y) всех ячеек змеи
 * len - Начальная длина змеи
 * color - Цвет змеи
 * scope - Текущее количество съеденых яблок
 * __proto__ - Ссылка на прототип
 * moving - функция отвечающая за передвижение
 */
var snake = {
    x: 6,
    y: 4,
    dx: 0,
    dy: 0,
    cord: [],
    len: 4,
    color: "#5dc70c",
    score: 0,
    __proto__: el,
    moving: function() {
        this.x += this.dx;
        this.y += this.dy;
    }
};

/**
 * Объект, описывающий "Яблоко".
 * Данным объектом "питается" змея. Координаты размещения объекта на игровом поле выбираются случайно.
 * @type {{x: number, y: number, color: string, __proto__: {px: number, a: number, color: string}, get_cord: apple.get_cord}}
 * x - Координата по оси x
 * y - Координата по оси y
 * color - Цвет яблока
 * __proto__ - Прототипом является простейший объект
 * get_cord - Функция для случайного выбора координат
 */
var apple = {
    x: Math.floor(Math.random() * el.a),
    y: Math.floor(Math.random() * el.a),
    color: "#c91212",
    __proto__: el,

    get_cord: function() { //метод размещения яблока
        this.x=Math.floor(Math.random() * el.a);
        this.y=Math.floor(Math.random() * el.a);
    }
};

/**
 * Событие.
 * Наступает при загрузке всей страницы.
 * Получает html объект canvas по id, задает 2d рабочую область.
 * Задает обработчик нажатия клавиш.
 * Запускает функцию game с указанным интервалом.
 */
window.onload = function() {
    canv=document.getElementById("snake");
    window.context=canv.getContext("2d");
    document.addEventListener("keydown", keyPush);
    setInterval(game, 1000/10);
};

/**
 * Обработка нажатия клавиш.
 * Обрабатывает нажатия пользователя на клавиши стрелок.
 * В зависимости от нажатой клавиши выбирается направление движения змеи.
 * 37 - лево
 * 38 - верх
 * 39 - право
 * 40 - низ
 * @param event - Событие "Нажатие на клавишу"
 */
function keyPush(event) {
    //лево
    if (event.keyCode === 37) {
        if (snake.dx !== 1) {
            snake.dx = -1;
            snake.dy = 0;
        }
    }
    //вверх
    if (event.keyCode === 38) {
        if (snake.dy !== 1) {
            snake.dx = 0;
            snake.dy = -1;
        }
    }
    //право
    if (event.keyCode === 39) {
        if (snake.dx !== -1) {
            snake.dx = 1;
            snake.dy = 0;
        }
    }
    //вниз
    if (event.keyCode === 40) {
        if (snake.dy !== -1) {
            snake.dx = 0;
            snake.dy = 1;
        }
    }
}

function game() {

    el.px = canv.height / el.a;

    snake.moving();

    //проход через "стены"
    if (snake.x < 0) {
        snake.x = el.a - 1;
    }
    if (snake.x > el.a - 1) {
        snake.x = 0;
    }
    if (snake.y < 0) {
        snake.y = el.a - 1;
    }
    if (snake.y > el.a - 1) {
        snake.y = 0;
    }

    context.fillStyle = el.color;
    context.fillRect(0, 0, canv.width, canv.height);
    context.fillStyle = snake.color;

    //отрисовка змеи и отслеживание "столкновений"
    for (var i = 0; i < snake.cord.length; i++) {
        context.fillRect(snake.cord[i].x * el.px, snake.cord[i].y * el.px, el.px-2, el.px-2);
        if (snake.cord[i].x === snake.x && snake.cord[i].y === snake.y) {
            snake.score = 0;
            snake.len = 4;
        }
        if (snake.cord[i].x === apple.x && snake.cord[i].y === apple.y) {
            apple.get_cord();
        }
    }

    //движение реализовано с помощью добавление новых координат в конец массива
    //и удаление старых из начала
    snake.cord.push({x: snake.x, y: snake.y});

    while (snake.cord.length > snake.len) {
        snake.cord.shift();
    }

    //"поедание" яблока
    if (apple.x === snake.x && apple.y === snake.y) {
        snake.len++;
        snake.score++;
        apple.get_cord();
    }

    //расположение яблока на игровом поле
    context.fillStyle = apple.color;
    context.fillRect(apple.x*el.px, apple.y*el.px, el.px-2, el.px-2);
    //отображение прогресса
    context.fillStyle = "#ff4f00";
    context.font = "bold 12px sans-serif";
    context.fillText("You progress: " + snake.score, 5, 15);
}